const dedent = require('dedent-js');

const { beautify } = require("../lib");

describe('Beatify template without custom delimiters', () => {
    it('Base HTML template', () => {
        const template = beautify('<div><h2>Hello!</h2></div>');

        expect(template).toBe(dedent`
            <div>
                <h2>Hello!</h2>
            </div>
        `);
    });
    it('Simple EJS template', () => {
        const template = beautify('<div><h2>Hello<%=user.name%>!</h2></div>');

        expect(template).toBe(dedent`
            <div>
                <h2>Hello
                    <%= user.name %>!
                </h2>
            </div>
        `);
    });

    it('Medium EJS template', () => {
        const template = beautify('<%if(user){%><h2><%= user.name %></h2><%}%>');

        expect(template).toBe(dedent`
            <% if (user) { %>
                <h2>
                    <%= user.name %>
                </h2>
            <% } %>
        `);
    });

    it('Complex EJS template', () => {
        const template = beautify('<div><h2>Hello <%= user.name %>!</h2><%if(links&&links.length>0){%><h3>You received a list of vouchers</h3><%for(var i=0;i<links.length;i++){%><h3><%=links[i]%></h3><%}%><%}%></div>');

        expect(template).toBe(dedent`
            <div>
                <h2>Hello
                    <%= user.name %>!
                </h2>
                <% if (links && links.length > 0) { %>
                    <h3>You received a list of vouchers</h3>
                    <% for (var i = 0; i < links.length; i++) { %>
                        <h3>
                            <%= links[i] %>
                        </h3>
                    <% } %>
                <% } %>
            </div>
        `);
    });
});