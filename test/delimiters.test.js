const dedent = require('dedent-js');

const { beautify } = require("../lib");

describe('Beatify template with custom delimiters', () => {
    it('Simple EJS template with custom delimiters', () => {
        const template = beautify('<div><h2>Hello{%=user.name%}!</h2></div>', {
            openDelimiter: "{",
            closeDelimiter: "}"
        });

        expect(template).toBe(dedent`
            <div>
                <h2>Hello
                    {%= user.name %}!
                </h2>
            </div>
        `);
    });

    it('Medium EJS template with custom delimiters', () => {
        const template = beautify('p@if(user){@q<h2>p@=user.name@q</h2>p@}@q', {
            delimiter: "@",
            openDelimiter: "p",
            closeDelimiter: "q"
        });

        expect(template).toBe(dedent`
            p@ if (user) { @q
                <h2>
                    p@= user.name @q
                </h2>
            p@ } @q
        `);
    });

    it('Complex EJS template with custom delimiters', () => {
        const template = beautify('<div><h2>Hello p@= user.name @q!</h2>p@if(links&&links.length>0){@q<h3>You received a list of vouchers</h3>p@for(var i=0;i<links.length;i++){@q<h3>p@=links[i]@q</h3>p@}@qp@}@q</div>', {
            delimiter: "@",
            openDelimiter: "p",
            closeDelimiter: "q"
        });
    
        expect(template).toBe(dedent`
            <div>
                <h2>Hello
                    p@= user.name @q!
                </h2>
                p@ if (links && links.length > 0) { @q
                    <h3>You received a list of vouchers</h3>
                    p@ for (var i = 0; i < links.length; i++) { @q
                        <h3>
                            p@= links[i] @q
                        </h3>
                    p@ } @q
                p@ } @q
            </div>
        `);
    });
});