(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.StructTeacher = factory());
}(this, (function () { 'use strict';

  const isObject = obj => (Object.prototype.toString.call(obj) === '[object Object]');

  class Teacher {
    static Factory(model, sourceData) {
      return new Teacher(model, sourceData);
    }

    constructor(model, sourceData, nameSpace = { type: 'type', default: 'default', all: 'all' }) {
      this.model = model;
      this.sourceData = sourceData;
    }

    setNameSpace(nameSpace) {
      this.nameSpace = nameSpace;
    }

    doFix(model = this.model, sourceData = this.sourceData, newData = {}) {
      for (const [k, v] of Object.entries(model)) {
        // 如果是数组
        if (Array.isArray(v)) {
          // 新对象当前这个k设置为空数组
          newData[k] = [];
          // console.log(sourceData);
          sourceData[k].forEach((item, index) => {
            if (model[k][0].all) {
              model[k][index] = model[k][0];
            }

            const curModel = (() => {
              if (model[k][index]) {
                return model[k][index];
              }

              return model[k][0];
            })();
            if (curModel.type && [String, Number, Boolean].includes(curModel.type)) {

              // 说明是基础类型
              let val = item;
              if (!item) {
                val = curModel.default;
              }

              newData[k][index] = val;
              return;
            }

            // 如果当前这一项是对象
            if (isObject(item)) {
              newData[k][index] = {};
              this.doFix(curModel, item, newData[k][index]);
              return;
            }

            // 如果当前这一项是数组
            if (Array.isArray(item)) {
              newData[k][index] = [];
              this.doFix(model[k][0], item, newData[k][index]);
              return;
            }

            newData[k] = sourceData[k];
          });
          continue;
        }

        // 如果原数据没有 则赋值默认值
        if (!sourceData[k]) {
          newData[k] = v.default;
          continue;
        }
        // console.log(v);
        if (!v.type) {
          newData[k] = {};
          this.doFix(v, sourceData[k], newData[k]);
          continue;
        }

        // 如果是对象的情况 但是又指定了这个对象的默认值 就选择默认值 不再继续对比
        if (v.default && Object.keys(v).length > 2) {
          newData[k] = v.default;
          continue;
        }

        newData[k] = sourceData[k];
      }
    }

    fix() {
      const newData = {};

      this.doFix(this.model, this.sourceData, newData);

      console.log(newData);
      console.log(JSON.stringify(newData));
    }

    setDefault(val) {
      this.defaultValue = val;
    }
  }

  var index = Teacher.Factory;

  return index;

})));
