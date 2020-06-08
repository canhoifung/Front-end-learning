# Cookie

为服务器保存在浏览器的一小段文本信息，一般不超过4kb

主要保存状态信息，如：

- 对话（session）管理：保存登录、购物车等需要记录的信息。
- 个性化信息：保存用户的偏好，比如网页的字体大小、背景色等等。
- 追踪用户：记录和分析用户行为。

==只有那些每次请求都需要让服务器知道的信息才放在Cookie里面，其余的应该放在Web storage API和IndexedDB==

每个Cookie都有这五方面的元数据：

- Cookie 的名字
- Cookie 的值（真正的数据写在这里面）
- 到期时间（超过这个时间会失效）
- 所属域名（默认为当前域名）
- 生效的路径（默认为当前网址）

```javascript
document.cookie;//返回当前网站的Cookie
```

一般来说，单个域名设置的 Cookie 不应超过30个，每个 Cookie 的大小不能超过4KB。超过限制以后，Cookie 将被忽略，不会被设置。

浏览器的同源政策规定，两个网址只要域名相同，不一定协议相同，就可以共享 Cookie

## Cookie与HTTP协议

Cookie由HTTP协议生成

### HTTP回应：Cookie的生成

服务器如果希望在浏览器保存 Cookie，就要在 HTTP 回应的头信息里面，放置一个`Set-Cookie`字段。

```php+HTML
Set-Cookie:foo=bar
```

一个回应可以包含多个`Set-Cookie`字段：

```php+HTML
HTTP/1.0 200 OK
Content-type: text/html
Set-Cookie: yummy_cookie=choco
Set-Cookie: tasty_cookie=strawberry

[page content]
```

还可以附加Cookie的属性，可一个字段包括多个属性

```php+HTML
Set-Cookie: <cookie-name>=<cookie-value>; Expires=<date>
Set-Cookie: <cookie-name>=<cookie-value>; Max-Age=<non-zero-digit>
Set-Cookie: <cookie-name>=<cookie-value>; Domain=<domain-value>
Set-Cookie: <cookie-name>=<cookie-value>; Path=<path-value>
Set-Cookie: <cookie-name>=<cookie-value>; Secure
Set-Cookie: <cookie-name>=<cookie-value>; HttpOnly
Set-Cookie: <cookie-name>=<cookie-value>; Domain=<domain-value>; Secure; HttpOnly
```

若服务器端想修改早先设置的Cookie，必须满足：

+ `key`
+ `domain`
+ `path`
+ `secure`

都匹配，否则就会生成新的Cookie

```javascript
Set-Cookie: key1=value1; domain=example.com; path=/blog
//改变上面这个 Cookie 的值，就必须使用同样的Set-Cookie。
Set-Cookie: key1=value2; domain=example.com; path=/blog
```

若key相同，其他不同的同名Cookie，匹配越精确的就排在越前面，被服务器同时返回

### HTTP请求：Cookie的发送

要使用到HTTP头信息的`Cookie`字段：

```javascript
Cookie: foo=bar;name=value; name2=value2; name3=value3
```

==服务器收到浏览器发来的Cookie时，无法得知以下两点：==

+ Cookie 的各种属性，比如何时过期。
+ 哪个域名设置的 Cookie，到底是一级域名设的，还是某一个二级域名设的。

## Cookie属性

### Expires

`Expires`指定一个具体的到期时间，到期后浏览器就不再保存这个Cookie

值为UTC格式，可以用`Date.prototype.toUTCString()`进行格式转换

```javascript
Set-Cookie: id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT;
```

若不设置或为`null`，Cookie只在当前会话即当前session有效，浏览器关闭窗口就会被删除

==过期时间是浏览器根据本地时间决定的，不精确==

### Max-Age

指定从现在开始Cookie存在的==秒数==，超过时间浏览器就会删除Cookie

若同时指定了`Expires`和`Max-Age`，则`Max-Age`优先生效

若不设置，则Cookie在会话结束后被删除

### Domain

指定浏览器发送HTTP请求时，哪些==域名==要携带这个Cookie

默认为当前域名，即子域名不会附带这个Cookie

如果设置了，则子域名也会附带这个Cookie，若指定的域名不属于当前域名，会被浏览器拒绝

### Path

指定浏览器发送HTTP请求时，哪些==路径==要携带这个Cookie

若`Path`属性为HTTP请求路径的开头部分，浏览器就会在头信息带上这个Cookie

比如，`PATH`属性是`/`，那么请求`/docs`路径也会包含该 Cookie

### Secure

指定浏览器只有在加密协议HTTPS下，才能将Cookie发送到服务器

若当前协议是HTTP，浏览器会自动忽略服务器的`Secure`属性

若通信是HTTPS协议，自动带有这个属性

### HttpOnly

指定该Cookie无法通过JavaScript脚本获取，即`document.cookie`和`XMLHttpRequest`对象和RequestAPI都无法获取

只有当浏览器发送HTTP请求时才会带上

### SameSite

用于防止CSRF攻击和用户追踪

用来限制第三方Cookie，减少安全风险

可以设置三个值：

+ Strict
+ Lax
+ None

#### Strict

完全禁止第三方Cookie，跨站点时任何情况下都不会发送Cookie

```javascript
Set-Cookie: CookieName=CookieValue; SameSite=Strict;
```

#### Lax

除了导航到目标网址的Get请求外不发送第三方Cookie

```javascript
Set-Cookie: CookieName=CookieValue; SameSite=Strict;
```

只包括三种情况：

+ 链接
+ 预加载请求
+ GET表单

| 请求类型  |                 示例                 |    正常情况 | Lax         |
| :-------- | :----------------------------------: | ----------: | :---------- |
| 链接      |         `<a href="..."></a>`         | 发送 Cookie | 发送 Cookie |
| 预加载    | `<link rel="prerender" href="..."/>` | 发送 Cookie | 发送 Cookie |
| GET 表单  |  `<form method="GET" action="...">`  | 发送 Cookie | 发送 Cookie |
| POST 表单 | `<form method="POST" action="...">`  | 发送 Cookie | 不发送      |
| iframe    |    `<iframe src="..."></iframe>`     | 发送 Cookie | 不发送      |
| AJAX      |            `$.get("...")`            | 发送 Cookie | 不发送      |
| Image     |          `<img src="...">`           | 发送 Cookie | 不发送      |

#### None

显示关闭`SameSite`属性

必须同时设置`Secure`属性，否则无效

下面的设置无效。

```javascript
Set-Cookie: widget_session=abc123; SameSite=None
```

下面的设置有效。

```JavaScript
Set-Cookie: widget_session=abc123; SameSite=None; Secure
```

## document.cookie

用于读写当前网页的Cookie

若Cookie没有`HTTPOnly`属性，就可以返回当前网页的所有Cookie

==可写==，但一次只能写入一个Cookie，且不会覆盖，而是添加

```javascript
document.cookie = "foo=bar; expires=Fri, 31 Dec 2020 23:59:59 GMT";
```

各个属性的写入注意点如下。

- `path`属性必须为绝对路径，默认为当前路径。
- `domain`属性值必须是当前发送 Cookie 的域名的一部分。比如，当前域名是`example.com`，就不能将其设为`foo.com`。该属性默认为当前的一级域名（不含二级域名）。
- `max-age`属性的值为秒数。
- `expires`属性的值为 UTC 格式，可以使用`Date.prototype.toUTCString()`进行日期格式转换。

删除现存Cookie的唯一方法，是设置它的`expires`属性为一个过去的日期





















