var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
require('rxjs/add/operator/map');
/*
 Generated class for the App provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
var App = (function () {
    function App(http) {
        this.http = http;
    }
    App.prototype.getFormattedBaseUrl = function (url) {
        this.formattedBaseUrl = "";
        var urlToBeFormatted = "", urlArray = [], baseUrlString;
        if (!(url.split('/')[0] == "https:" || url.split('/')[0] == "http:")) {
            urlToBeFormatted = "http://" + url;
        }
        else {
            urlToBeFormatted = url;
        }
        baseUrlString = urlToBeFormatted.split('/');
        for (var index in baseUrlString) {
            if (baseUrlString[index]) {
                urlArray.push(baseUrlString[index]);
            }
        }
        this.formattedBaseUrl = urlArray[0] + '/';
        for (var i = 0; i < urlArray.length; i++) {
            if (i != 0) {
                this.formattedBaseUrl = this.formattedBaseUrl + '/' + urlArray[i];
            }
        }
        return Promise.resolve(this.formattedBaseUrl);
    };
    App.prototype.getDataBaseName = function (url) {
        var databaseName = url.replace('://', '_').replace('/', '_').replace('.', '_').replace(':', '_');
        return Promise.resolve(databaseName);
    };
    App = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], App);
    return App;
})();
exports.App = App;