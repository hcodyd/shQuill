'use strict';

let React = require('react'),
    ReactDOMServer = require('react-dom/server'),
    T = React.PropTypes;

let defaultColors = [
    'rgb(  0,   0,   0)', 'rgb(230,   0,   0)', 'rgb(255, 153,   0)',
    'rgb(255, 255,   0)', 'rgb(  0, 138,   0)', 'rgb(  0, 102, 204)',
    'rgb(153,  51, 255)', 'rgb(255, 255, 255)', 'rgb(250, 204, 204)',
    'rgb(255, 235, 204)', 'rgb(255, 255, 204)', 'rgb(204, 232, 204)',
    'rgb(204, 224, 245)', 'rgb(235, 214, 255)', 'rgb(187, 187, 187)',
    'rgb(240, 102, 102)', 'rgb(255, 194, 102)', 'rgb(255, 255, 102)',
    'rgb(102, 185, 102)', 'rgb(102, 163, 224)', 'rgb(194, 133, 255)',
    'rgb(136, 136, 136)', 'rgb(161,   0,   0)', 'rgb(178, 107,   0)',
    'rgb(178, 178,   0)', 'rgb(  0,  97,   0)', 'rgb(  0,  71, 178)',
    'rgb(107,  36, 178)', 'rgb( 68,  68,  68)', 'rgb( 92,   0,   0)',
    'rgb(102,  61,   0)', 'rgb(102, 102,   0)', 'rgb(  0,  55,   0)',
    'rgb(  0,  41, 102)', 'rgb( 61,  20,  10)',
].map(function (color) {
    return {value: color}
});

let defaultItems = [

    {
        label: 'Formats', type: 'group', items: [
        {
            label: 'Font', type: 'font', items: [
            {label: 'Arial', value: 'Arial, sans-serif'},
            {label: 'Comic Sans MS', value: '"Comic Sans MS", cursive, sans-serif'},
            {label: 'Georgia', value: 'Georgia, serif'},
            {label: 'Impact', value: 'Impact, sans-serif'},
            {label: 'Tahoma', value: 'Tahoma, sans-serif'},
            {label: 'Verdana', value: 'Verdana, sans-serif'},
            {label: 'Calibri', value: 'Calibri, san-serif'},
            {label: 'Times New Roman', value: '"Times New Roman", Times, serif'}
        ]
        },
        {
            label: 'Size', type: 'size', items: [
            {label: 'Small', value: '10px'},
            {label: 'Normal', value: '13px'},
            {label: 'Large', value: '18px'},
            {label: 'Huge', value: '32px'}
        ]
        },
        {
            label: 'Alignment', type: 'align', items: [
            {label: '', value: '', selected: true},
            {label: '', value: 'center'},
            {label: '', value: 'right'},
            {label: '', value: 'justify'}
        ]
        }
    ]
    },

    {
        label: 'Text', type: 'group', class: 'addthis', items: [
        {type: 'bold', label: 'Bold'},
        {type: 'italic', label: 'Italic'},
        {type: 'strike', label: 'Strike'},
        {type: 'underline', label: 'Underline'},
        {type: 'color', label: 'Color', items: defaultColors},
        {type: 'background', label: 'Background color', items: defaultColors},
        {type: 'link', label: 'Link'}
    ]
    },

    {
        label: 'Blocks', type: 'group', items: [
        {type: 'list', value: 'bullet'},
        {type: 'list', value: 'ordered'}
    ]
    },

    {
        label: 'Blocks', type: 'group', items: [
        {type: 'image', label: 'Image'},
        {type: 'clean', label: 'Clean'}
    ]
    }

];

let QuillToolbar = React.createClass({

    displayName: 'Quill Toolbar',

    propTypes: {
        id: T.string,
        className: T.string,
        items: T.array
    },

    getDefaultProps: function () {
        return {
            items: defaultItems
        };
    },

    renderGroup: function (item, key) {
        return React.DOM.span({
                key: item.label || key,
                className: 'ql-formats'
            },
            item.items.map(this.renderItem)
        );
    },

    renderChoiceItem: function (item, key) {
        return React.DOM.option({
                key: item.label || item.value || key,
                value: item.value
            },
            item.label
        );
    },

    renderChoices: function (item, key) {
        let attrs = {
            key: item.label || key,
            title: item.label,
            className: 'ql-' + item.type
        };
        let self = this;
        let choiceItems = item.items.map(function (item, key) {
            if (item.selected) {
                attrs.defaultValue = item.value;
            }
            return self.renderChoiceItem(item, key);
        });
        return React.DOM.select(attrs, choiceItems);
    },

    renderButton: function (item, key) {
        return React.DOM.button({
                type: 'button',
                key: item.label || item.value || key,
                value: item.value,
                className: 'ql-' + item.type,
                title: item.label
            },
            item.children
        );
    },

    renderAction: function (item, key) {
        return React.DOM.span({
                key: item.label || item.value || key,
                className: 'ql-' + item.type,
                title: item.label
            },
            item.children
        );
    },

    renderItem: function (item, key) {
        switch (item.type) {
            case 'group':
                return this.renderGroup(item, key);
            case 'font':
            case 'header':
            case 'align':
            case 'size':
            case 'color':
            case 'background':
                return this.renderChoices(item, key);
            case 'bold':
            case 'italic':
            case 'underline':
            case 'strike':
            case 'link':
            case 'list':
            case 'bullet':
            case 'ordered':
            case 'indent':
            case 'image':
            case 'video':
            case 'clean':
                return this.renderButton(item, key);
            default:
                return this.renderAction(item, key);
        }
    },

    getClassName: function () {
        return 'quill-toolbar ' + (this.props.className || '');
    },

    render: function () {
        let children = this.props.items.map(this.renderItem);
        let html = children.map(ReactDOMServer.renderToStaticMarkup).join('');
        return React.DOM.div({
            className: this.getClassName(),
            style: this.props.style || {},
            dangerouslySetInnerHTML: {__html: html}
        });
    }

});

module.exports = QuillToolbar;
QuillToolbar.defaultItems = defaultItems;
QuillToolbar.defaultColors = defaultColors;
