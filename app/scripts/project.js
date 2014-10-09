// Generated by CoffeeScript 1.8.0
(function() {
  var app;

  app = angular.module('walletApp', ['LocalStorageModule']);

  app.controller('walletController', [
    '$scope', 'localStorageService', function($scope, localStorageService) {
      var items;
      items = localStorageService.get('walletItems');
      $scope.items = items != null ? items : [];
      $scope.persist = function() {
        return localStorageService.set('walletItems', $scope.items);
      };
      $scope.getTotal = function() {
        return _.reduce($scope.items, function(memo, item) {
          return memo + item.amount;
        }, 0);
      };
      $scope.addItem = function(walletForm, amount) {
        if ($scope.getTotal() + amount < 0) {
          walletForm.$setValidity("negativeTotal", false, "trans-value");
        } else {
          walletForm.$setValidity("negativeTotal", true, "trans-value");
        }
        if (walletForm.$invalid) {
          return;
        }
        $scope.items.push({
          date: new Date(),
          amount: amount
        });
        return $scope.persist();
      };
      $scope.onlyNumbers = /^[1-9][0-9]*$/;
      $scope.addAmount = function(walletForm, amount) {
        return $scope.addItem(walletForm, amount);
      };
      $scope.removeAmount = function(walletForm, amount) {
        return $scope.addItem(walletForm, -amount);
      };
      $scope.resetItems = function() {
        $scope.items = [];
        return $scope.persist();
      };
      return $scope.$on('resetWallet', function(e, args) {
        return $scope.resetItems();
      });
    }
  ]);

  app.controller('menuController', [
    '$scope', function($scope) {
      return $scope.reset = function() {
        return $scope.$emit('resetWallet', {});
      };
    }
  ]);

  app.controller('sourceController', [
    '$scope', '$http', function($scope, $http) {
      var sources;
      sources = ["index.jade", "partials/menu.jade", "partials/wallet.jade", "partials/source.jade", "scripts/project.coffee", "styles/style.styl"];
      $scope.sources = [];
      return async.each(sources, function(item, cb) {
        return $http({
          method: 'GET',
          url: '/' + item
        }).success(function(data, status, headers, config) {
          return $scope.sources.push({
            filename: item,
            source: data
          });
        }).error(function(data, status, headers, config) {
          return $scope.sources.push({
            filename: item,
            source: "ERROR READING FILE"
          });
        });
      });
    }
  ]);

}).call(this);
