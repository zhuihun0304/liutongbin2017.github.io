---
layout:     post
title:      Effective JavaScript (十)
subtitle:   并发
date:       2018-09-28
author:     "toshiba"
header-img: "images/bg/batman/bat8.jpg"
comments: true

tags :
    - javascript
    - 读书总结
categories:
    - 读书总结
---


## 并发

JavaScript被设计成一种嵌入式的脚本语言。它不是以单独的应用程序运行，而是作为大型应用程序环境下的脚本运行。典型的例子当然是Web浏览器。
JavaScript中编写响应多个并发事件的程序的方法非常人性化，而且强大，因为它使用了一个简单的执行模型(有时称为事件队列和事件循环并发)和被称为异步的API.
奇怪的是，到目前为止，ECMAScript标准从来没有关于并发的说明。我们讨论的都是“约定成俗”的JavaScript特性，并不是官方标准。然而，绝大多数JavaScript的环境都使用相同的并发策略，未来标准的版本很有可能会基于广泛实现的执行模型来标准化。不管标准如何定义，使用事件和异步API是JavaScript编程的基础部分。

## 不要阻塞I/O事件队列

JavaScript程序是建立在事件之上的。输入可能来自各种各样的外部源，用户的交互操作，输入的网络数据或定时警报，我们通常会写这样的代码来等待某个特定的输入
```
var text = downloadSync("http://example.com/file.txt");

console.log(text);
```
这样的函数通常被称为同步函数或阻塞函数， 程序会停止工作，等待它的输入。这个例子是等的网络下载文件的结果。

在JavaScript中，大多数的I/O操作都提供了异步的或非阻塞的API, 程序提供一个回调函数，一旦输入完成就可以被系统调用， 而不是将程序阻塞在等待结果的线程上。
```
dowanloadAsync("http://example.com/file.txt", function(text) {
	console.log(text);
})
```

JavaScript并发的一个重要规则是绝不要在应用程序事件队列中使用阻塞I/O的API。对于Web应用程序的交互性，同步的I/O会导致灾难性的结果，在操作完成之前一直会阻塞用户于页面的交互。


Web平台提供了Workder的API，使得产生大量的并行计算称为可能。不同于传统的线程执行Workders在一个完全隔离的状态下进行，没有获取全局作用域或应用程序主线程Web页面内容的能力。因此它不回妨碍主事件队列中运行的代码的执行。在一个Worker中使用XMLHttpRequest同步的变种很少出问题。下载操作的确会阻塞Worker继续运行，但这并不会组织要么的渲染或事件队列中的事件响应。


## 在异步序列中使用嵌套或命名的回调函数


```
db.lookupAsync("url", function(url) {
	//	
});

downloadAsync(url, function(text) {
	console.log("contents of " + url + " : " + text);
});

```
两个异步函数第二个的url读取不到，我们可以使用嵌套


```
db.lookupAsync("url", function(url) {
	downloadAsync(url, function(text) {
		console.log("contents of " + url + " : " + text);
	});
});


```

但是回调函数越来越多会变得很笨拙。

```
db.lookupAsync("url", function(url) {
	downloadAsync(url, function(text) {
		downloadAsync("a.txt", function(a) {
			downloadAsync("b.txt", function(b) {
				// ...
			})	
		})
	});
});


```

减少嵌套的方法之一就是将嵌套的回调函数作为命名的函数。

```
db.lookupAsync("url", downloadURL);


// 仍然有嵌套
function downloadURL(url) {
	downloadAsync(url, function(text) {
		showContents(url, text);
	});
}

function showContents(url, text) {
	console.log("contents of " + url + " : " + text);
}

```

上面的例子中仍然有嵌套，我们可以使用bind方法消除最深层的嵌套回调函数。

```
db.lookupAsync("url", downloadURL);


// 仍然有嵌套
function downloadURL(url) {
	downloadAsync(url, showContents.bind(null, url));
}

function showContents(url, text) {
	console.log("contents of " + url + " : " + text);
}

```

但是如果层级过多仍然会有问题， 比如
```
db.lookupAsync("url", downloadURL);


function downloadURL(url) {
	downloadAsync(url, downloadABC.bind(null, url));
}

function downloadABC(url, file) {
	downloasAsync("a.txt", downloadFileBC.bind(null, url, file))
}

function downloadBC(url, file, a) {
	downloasAsync("b.txt", downloadFileFinish.bind(null, url, file, a))
}

function downloadFileFinish(url, file, a, b) {
	// ...
}

```
比如尴尬的函数命名，和参数传递。最好的方式还是将两种方式结合。

```

db.lookupAsync("url", function(url) {
	downloadURLAndFiles(url);
});


function downloadURLAndFiles(url) {
	downloadAsync(url, downloadFiles.bind(null, url));
}

function downloadFiles(url, file) {
	downloadAsync("a.txt", function(a) {
		downloadAsync("b.txt", function(b) {
			// ...
		})	
	})
}

```

更好的方法是抽象出一个可以下载多个文件的方法
```
function downloadFiles(url, file) {
	downloadAllAsync(["a.txt", "b.txt", "c.txt"], function(all) {
		var a = all[0], b = all[1], c = all[2];
	})
}
```

## 当心丢弃错误

同步代码我们可以通过<code>try...catch</code>来捕获所有错误，比如
```
try {
	f();
	g();
	h();
} catch(e) {
	// handle any error that occured
}


```
但是异步代码根本不可能抛出异常， 通常异步API会有一个额外的回调函数来处理网络错误。

```

downloadAsync("url", function(text) {
		
}, function(err) {
	console.log("Error " + err)	;
});

多个回调时可以提取公共部分

function onErr(err) {
	console.log("Error " + err)	;
}

downloadAsync("url", function(text) {
		
}, onErr);

```

Node.js 异步处理API的错误处理，我们通过if判断来控制每个回调函数

```
function onErr(err) {
	console.log("Error " + err)	;
}

downloadAsync("url", function(error, text) {
	if(error) {
		onError(error);
		return false;
	}

	//success
});


更简洁写法

downloadAsync("url", function(error, text) {
	if(error) return onError(error);

	//success
});


```

## 对异步循环使用递归

如果一个函数接受一个URL的数组并尝试下载买每个文件，如果API是同步的很容易实现

```
function downloadOneSync(urls) {
	for(var i = 0, n = urls.length; i < n; i++) {
		try {
			return downloadSync(urls[i]);
		} catch(e) {

		}
	}

	throw new Error("all downloads failed");
}
如果调用downloadAsync的话会所有文件一起下载没有顺序，所以我们需要这样做在每个回调结束调用自身

function downloadOneAsync(urls, onsuccess, onfailur) {
	var n = urls.length;

	function tryNextURL(i) {
		if(i >= n) {
			onfailur("all downloads failed");
			return;
		}

		downloadAsync(urls[i], onsuccess, function() {
			tryNextURL(i + 1);
		})
	}

	tryNextURL(0)
}
```

局部函数tryNextURL是一个递归函数。它的实现调用了自身。 目前典型的JavaScript环境中一个递归函数调用自身多次会导致失败。
因为当一个程序执行有太多的函数调用，它会耗尽栈空间，最终抛出异常。这种情况被称为栈溢出。

该例子调用100000次会产生一个运行时错误。
```

function countdown(n) {
	if(n === 0) {
		return "done";
	} else {
		return countdown(n -1);
	}
}

```

异步操作不需要等待递归回调返回后才返回，调用栈不回有十万个函数在等待。每次有进有出只调用一个。

* 循环不能是异步的
* 使用递归函数在事件循环的单独轮次中执行迭代
* 在事件循环的单独轮次中执行递归，并不会导致栈溢出


## 不要在计算时阻塞事件队列

如果你的程序需要执行代价高昂的计算你该怎么办，最简单的方法就是使用想Web客户端平台的Worker API这样的并发机制。

```

var ai = new Worker('ai.js');

var userMove = /* *** */;

ai.postMessage(JSON.stringify({
	userMOve: userMove
}));


ai.onmessage = function(event) {
	executeMove(JSON.parse(event.data).computerMove);
}
```
这样会产生一个新的线程独立的事件队列的并发执行线程。该worker是一个完全隔离的状态--没有任何应用程序对象的直接访问。但是，应用程序于worker之间可以功过发送形式为字符串的message来交互。

* 避免在主事件队列中执行代价高昂的计算
* 在支持Worker API的平台，该API可以用来在一个独立的事件队列中运行长计算程序。
* 在Worker API不可用活代价高昂的环境中，考虑将计算程序分解到事件循环的多个轮次中


## 使用计数器来执行并行操作

```
function downloadAllAsync(urls, onsuccess, onerror) {

	var result = [], length = urls.length;

	if(length === 0) {
		setTimeout(onsuccess.bind(null, result), 0);
		return;
	}

	urls.forEach(function(url) {
		downloadAsync(url, function(rext) {
			if(result) {
				result.push(text);
				if(result.length === urls.length) {
					onsuccess(result);
				}
			}
		}, function(error) {
			if(result) {
				result = null;
				onerror(error);
			}
		});
	})
}

这段代码有个错误

var filenames = [
	"huge.txt",
	"tiny.txt",
	"medium.txt",
];

downloadAllAsync(filenames, function(files) {
	console.log("Huge file: " + files[0].length); // tiny
	console.log("Tiny file: " + files[0].length); // medium
	console.log("Medium file: " + files[0].length); // huge
}, function(error) {
	console.log("Error : " + error);
});


```
这里下载文件的顺序并不可控，因为文件是并行下载的。 调用者无法找出那个结果对应哪个文件， 上面的例子假设结果合输入有相同的顺序其实是错误的


```
function downloadAllAsync(urls, onsuccess, onerror) {

	var result = [], length = urls.length;

	if(length === 0) {
		setTimeout(onsuccess.bind(null, result), 0);
		return;
	}

	urls.forEach(function(url, i) {
		downloadAsync(url, function(text) {
			if(result) {
				
				result[i] = text;
				if(result.length === urls.length) {
					onsuccess(result);
				}
			}
		}, function(error) {
			if(result) {
				result = null;
				onerror(error);
			}
		});
	})
}

```


这个版本也有问题如果先下载完成的是第三个文件则 result[2] = text; 那么result的长度也是3， 则直接在if条件中返回，用户的success回调函数将被过早调用，其参数为一个不完整的结果数组。

所以正确的方式应该是这样
```

function downloadAllAsync(urls, onsuccess, onerror) {

	var result = [], pending = urls.length;

	if(pending === 0) {
		setTimeout(onsuccess.bind(null, result), 0);
		return;
	}

	urls.forEach(function(url, i) {
		downloadAsync(url, function(text) {
			if(result) {
			
				result[i] = text;
				pending--;
				if(pending === 0) {
					onsuccess(result);
				}
			}
		}, function(error) {
			if(result) {
				result = null;
				onerror(error);
			}
		});
	})
}

```



## 绝不要同步的调用异步的回调函数

加入下载文件的例子有一个缓存

```
var cache = new Dict();

function downloadCachingAsync(url, onsuccess, onerrur) {
	if(cache.has(url)) {
		onsuccess(cache.get(url));  // 同步调用
	}

	return downloadAsync(url, function(file) {
		cache.set(url, file);
		onsuccess(file);
	}, onerror);
}

通常情况如果可以回立即提供数据，但这改变了用户预期

downloadAsync("file.txt", function(file) {
	console.log("finished");
});

console.log("starting");

这里按照我们预想 可能先返回 "starting" 然后 "finished", 但是由于同步调用了函数，
这里如果文件有缓存的话 先返回了"finished" 然后才是 "starting"; 这与我们的预想不符。
所以我们应该这样来使用

if(cache.has(url)) {
	var cached = cache.get(url);
	setTimeout(onsuccess.bind(null, cached), 0);
	return;
}

```



## 使用promise模式清洁异步逻辑

```

downloadAsync("file.txt", function(file) {
	console.log("file : " + file);
});


相比之下，基于promise的API不接受回调函数作为参数

var p = downloadP("file.txt");

p.then(function(file) {
	console.log("file: " + file);
});

promise的返回值是一个新的promise

var fileP = downloadP("file.txt");

var lengthP = fileP.then(function(file) {
	return file.length;
});

lengthP.then(function(length) {
	console.log("length: " + length);
});


```

promise通常提供给一个叫做when的工具函数，或者join

```
var filesP = join(downloadP("file1.txt"),
				downloadP("file2.txt"),
				downloadP("file3.txt"));

filesP.then(function(files) {
	// files[0]
});


var fileP1 = downloadP("file1.txt");
var fileP2 = downloadP("file2.txt");
var fileP3 = downloadP("file3.txt");

when([fileP1, fileP2, fileP3], function(files) {
	console.log("file1: " + files[0]);

})

```
使用select或choose工具函数可以使几个promise彼此竞争。

```
var filesP = select(downloadP("file1.txt"),
				downloadP("file2.txt"),
				downloadP("file3.txt"));

filesP.then(function(file) {
	//file
	// 返回值最先完成下载的文件的promise
});

```

select函数的另一个用途是提供超时来终止长时间的操作

```
var fileP = select(downloadP("file.txt"), timeoutErrorP(2000));

filep.then(function(file) {
	console.log("file: " + file);
}, function(error) {
	console.log("I/O error or timeout: " + error);
})

```