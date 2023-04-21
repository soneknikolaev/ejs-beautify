# EJS Beautify

## Introduction

EJS template beautify library. 

## Usage

```js
const { beautify } = require("ejs-beautify");

beautify('<div><h2>Hello <%= user.name %>!</h2><%if(links&&links.length>0){%><h3>Also, tou received a list of vouchers</h3><%for(var i=0;i<links.length;i++){%><h3><%=links[i]%></h3><%}%><%}%></div>'); /*
<div>
    <h2>Hello
        <%= user.name %>!
    </h2>
    <% if (links && links.length > 0) { %>
        <h3>Also, tou received a list of vouchers</h3>
        <% for (var i = 0; i < links.length; i++) { %>
            <h3>
                <%= links[i] %>
            </h3>
        <% } %>
    <% } %>
</div>
*/

beautify('<div><h2>Hello p@= user.name @q!</h2>p@if(links&&links.length>0){@q<h3>Also, tou received a list of vouchers</h3>p@for(var i=0;i<links.length;i++){@q<h3>p@=links[i]@q</h3>p@}@qp@}@q</div>', {
    delimiter: "@",
    openDelimiter: "p",
    closeDelimiter: "q"
});
/*
<div>
    <h2>Hello
        p@= user.name @q!
    </h2>
    p@ if (links && links.length > 0) { @q
        <h3>Also, tou received a list of vouchers</h3>
        p@ for (var i = 0; i < links.length; i++) { @q
            <h3>
                p@= links[i] @q
            </h3>
        p@ } @q
    p@ } @q
</div>
*/

```

## Installation

### Using npm

    npm install -D ejs-beautify

### Using yarn

    yarn add ejs-beautify