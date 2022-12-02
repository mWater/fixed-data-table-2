"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require('react'));

var _inRange = _interopRequireDefault(require('lodash/inRange'));

var _get = _interopRequireDefault(require('lodash/get'));

var _sortBy = _interopRequireDefault(require('lodash/sortBy'));

var _cx = _interopRequireDefault(require('././vendor_upstream/stubs/cx'));

var _emptyFunction = _interopRequireDefault(require('././vendor_upstream/core/emptyFunction'));

var _joinClasses = _interopRequireDefault(require('././vendor_upstream/core/joinClasses'));

var _FixedDataTableRow = _interopRequireDefault(require('././FixedDataTableRow'));

var _FixedDataTableTranslateDOMPosition = _interopRequireDefault(require('././FixedDataTableTranslateDOMPosition'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var FixedDataTableBufferedRows = /*#__PURE__*/function (_React$Component) {
  _inherits(FixedDataTableBufferedRows, _React$Component);

  var _super = _createSuper(FixedDataTableBufferedRows);

  function FixedDataTableBufferedRows(props) {
    var _this;

    _classCallCheck(this, FixedDataTableBufferedRows);

    _this = _super.call(this, props);
    _this._staticRowArray = [];
    _this._initialRender = true;
    return _this;
  }

  _createClass(FixedDataTableBufferedRows, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this._initialRender = false;
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate()
    /*boolean*/
    {
      // Don't add PureRenderMixin to this component please.
      return true;
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this._staticRowArray.length = 0;
    }
  }, {
    key: "render",
    value: function render()
    /*object*/
    {
      var _this$props = this.props,
          offsetTop = _this$props.offsetTop,
          rowOffsets = _this$props.rowOffsets,
          scrollTop = _this$props.scrollTop,
          isScrolling = _this$props.isScrolling,
          rowsToRender = _this$props.rowsToRender;
      rowsToRender = rowsToRender || [];

      if (isScrolling) {
        // allow static array to grow while scrolling
        this._staticRowArray.length = Math.max(this._staticRowArray.length, rowsToRender.length);
      } else {
        // when scrolling is done, static array can shrink to fit the buffer
        this._staticRowArray.length = rowsToRender.length;
      }
      /**
       * NOTE (pradeep): To increase vertical scrolling performance, we only translate the parent container.
       * This means, rows at a particular index won't need to be rerendered.
       *
       * But browsers have limits and are unable to translate the container past a limit (known here as bufferHeight).
       * To work around this, we wrap the translated amount over bufferHeight.
       *
       * For the container, the wrapped offset will be:
       *    const containerOffsetTop = offsetTop - (scrollTop % bufferHeight);
       *
       * Similarly, the row offset will also need to be wrapped:
       *    const rowOffsetTop = rowOffset - (Math.floor(scrollTop / bufferHeight) * bufferHeight);
       *
       * Therefore,
       *    (rowOffsetTop + containerOffsetTop)
       *      = offsetTop - (scrollTop % bufferHeight) + rowOffset - (Math.floor(scrollTop / bufferHeight) * bufferHeight)
       *      = offsetTop + rowOffset - scrollTop
       */


      var bufferHeight = 1000000;
      var containerOffsetTop = offsetTop - scrollTop % bufferHeight; // render each row from the buffer into the static row array

      for (var i = 0; i < this._staticRowArray.length; i++) {
        var rowIndex = rowsToRender[i]; // if the row doesn't exist in the buffer set, then take the previous one

        if (rowIndex === undefined) {
          rowIndex = this._staticRowArray[i] ? this._staticRowArray[i].props.index : undefined;

          if (rowIndex === undefined) {
            this._staticRowArray[i] = null;
            continue;
          }
        }

        var rowOffsetTop = rowOffsets[rowIndex] - Math.floor(scrollTop / bufferHeight) * bufferHeight;
        this._staticRowArray[i] = this.renderRow({
          rowIndex: rowIndex,
          key: i,
          rowOffsetTop: rowOffsetTop
        });
      } // We translate all the rows together with a parent div. This saves a lot of renders.


      var style = {};
      (0, _FixedDataTableTranslateDOMPosition["default"])(style, 0, containerOffsetTop, false); // NOTE (pradeep): Sort the rows by row index so that they appear with the right order in the DOM (see #221)

      var sortedRows = (0, _sortBy["default"])(this._staticRowArray, function (row) {
        return (0, _get["default"])(row, 'props.ariaRowIndex', Infinity);
      });
      return /*#__PURE__*/_react["default"].createElement("div", {
        style: style
      }, sortedRows);
    }
    /**
     * @typedef RowProps
     * @prop {number} rowIndex
     * @prop {number} key
     * @prop {number} rowOffsetTop
     *
     * @param {RowProps} rowProps
     * @return {!Object}
     */

  }, {
    key: "renderRow",
    value: function renderRow(_ref)
    /*object*/
    {
      var rowIndex = _ref.rowIndex,
          key = _ref.key,
          rowOffsetTop = _ref.rowOffsetTop;
      var props = this.props;
      var rowClassNameGetter = props.rowClassNameGetter || _emptyFunction["default"];
      var rowProps = {};
      rowProps.height = this.props.rowSettings.rowHeightGetter(rowIndex);
      rowProps.subRowHeight = this.props.rowSettings.subRowHeightGetter(rowIndex);
      rowProps.offsetTop = rowOffsetTop;
      rowProps.key = props.rowKeyGetter ? props.rowKeyGetter(rowIndex) : key;
      rowProps.attributes = props.rowSettings.rowAttributesGetter && props.rowSettings.rowAttributesGetter(rowIndex);
      var hasBottomBorder = rowIndex === props.rowSettings.rowsCount - 1 && props.showLastRowBorder;
      rowProps.className = (0, _joinClasses["default"])(rowClassNameGetter(rowIndex), (0, _cx["default"])('public/fixedDataTable/bodyRow'), (0, _cx["default"])({
        'fixedDataTableLayout/hasBottomBorder': hasBottomBorder,
        'public/fixedDataTable/hasBottomBorder': hasBottomBorder
      }));
      var visible = (0, _inRange["default"])(rowIndex, this.props.firstViewportRowIndex, this.props.endViewportRowIndex);
      return /*#__PURE__*/_react["default"].createElement(_FixedDataTableRow["default"], _extends({
        key: key,
        index: rowIndex,
        ariaRowIndex: rowIndex + props.ariaRowIndexOffset,
        isScrolling: props.isScrolling,
        width: props.width,
        rowExpanded: props.rowExpanded,
        scrollLeft: Math.round(props.scrollLeft),
        fixedColumns: props.fixedColumns,
        fixedRightColumns: props.fixedRightColumns,
        scrollableColumns: props.scrollableColumns,
        onClick: props.onRowClick,
        onContextMenu: props.onRowContextMenu,
        onDoubleClick: props.onRowDoubleClick,
        onMouseDown: props.onRowMouseDown,
        onMouseUp: props.onRowMouseUp,
        onMouseEnter: props.onRowMouseEnter,
        onMouseLeave: props.onRowMouseLeave,
        onTouchStart: props.onRowTouchStart,
        onTouchEnd: props.onRowTouchEnd,
        onTouchMove: props.onRowTouchMove,
        showScrollbarY: props.showScrollbarY,
        scrollbarYWidth: props.scrollbarYWidth,
        isRTL: props.isRTL,
        visible: visible
      }, rowProps));
    }
  }]);

  return FixedDataTableBufferedRows;
}(_react["default"].Component);

_defineProperty(FixedDataTableBufferedRows, "propTypes", {
  ariaRowIndexOffset: _propTypes["default"].number,
  isScrolling: _propTypes["default"].bool,
  firstViewportRowIndex: _propTypes["default"].number.isRequired,
  endViewportRowIndex: _propTypes["default"].number.isRequired,
  fixedColumns: _propTypes["default"].array.isRequired,
  fixedRightColumns: _propTypes["default"].array.isRequired,
  height: _propTypes["default"].number.isRequired,
  offsetTop: _propTypes["default"].number.isRequired,
  onRowClick: _propTypes["default"].func,
  onRowContextMenu: _propTypes["default"].func,
  onRowDoubleClick: _propTypes["default"].func,
  onRowMouseDown: _propTypes["default"].func,
  onRowMouseUp: _propTypes["default"].func,
  onRowMouseEnter: _propTypes["default"].func,
  onRowMouseLeave: _propTypes["default"].func,
  onRowTouchStart: _propTypes["default"].func,
  onRowTouchEnd: _propTypes["default"].func,
  onRowTouchMove: _propTypes["default"].func,
  rowClassNameGetter: _propTypes["default"].func,
  rowExpanded: _propTypes["default"].oneOfType([_propTypes["default"].element, _propTypes["default"].func]),
  rowOffsets: _propTypes["default"].object.isRequired,
  rowKeyGetter: _propTypes["default"].func,
  rowSettings: _propTypes["default"].shape({
    rowAttributesGetter: _propTypes["default"].func,
    rowHeightGetter: _propTypes["default"].func,
    rowsCount: _propTypes["default"].number.isRequired,
    subRowHeightGetter: _propTypes["default"].func
  }),
  rowsToRender: _propTypes["default"].array.isRequired,
  scrollLeft: _propTypes["default"].number.isRequired,
  scrollTop: _propTypes["default"].number.isRequired,
  scrollableColumns: _propTypes["default"].array.isRequired,
  showLastRowBorder: _propTypes["default"].bool,
  showScrollbarY: _propTypes["default"].bool,
  width: _propTypes["default"].number.isRequired,
  isRTL: _propTypes["default"].bool
});

var _default = FixedDataTableBufferedRows;
exports["default"] = _default;