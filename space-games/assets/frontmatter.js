/**
 * TODO: Make this into a frontmatter parsing script
 */

var footer =
    function(hook, vm) {
    // debugger;
        var footer = [
            '<hr/>',
            '<footer>',
            '<span><a href="https://github.com/QingWei-Li">cinwell</a> &copy;2017.</span>',
            '<span>Proudly published with <a href="https://github.com/docsifyjs/docsify" target="_blank">docsify</a>.</span>',
            '</footer>'
        ].join('');
    
        hook.afterEach(function(html) {
            return html; // + footer;
        });
    };