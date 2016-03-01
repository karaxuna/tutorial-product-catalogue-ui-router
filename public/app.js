// Initialize main module
var app = angular.module('app', ['ui.router']);

app.config(['$stateProvider', function ($stateProvider) {
    // Configure states
    $stateProvider
        // View list of products
        .state('catalogue', {
            url: '/catalogue',
            templateUrl: './views/catalogue.html',
            // Here we get products asynchronously and inject in controller.
            // Controller will not execute until `productSrvc.getAll()` promise gets resolved.
            resolve: {
                products: ['productSrvc', function (productSrvc) {
                    return productSrvc.getAll();
                }]
            },
            // `products` is available thanks to resolve
            controller: ['$scope', 'products', function ($scope, products) {
                $scope.products = products;
            }]
        })
        // View product info
        .state('product', {
            // Example: /product/3 where productId has value 3
            url: '/product/:productId',
            templateUrl: './views/product.html',
            // Get product by `productId` from path
            resolve: {
                product: ['$stateParams', 'productSrvc', function ($stateParams, productSrvc) {
                    return productSrvc.getById($stateParams.productId);
                }]
            },
            controller: ['$scope', 'product', function ($scope, product) {
                $scope.product = product;
            }]
        })
        // Similar product list
        .state('product.similars', {
            // This is child state, so it will inherit url from parent
            // For example this will match: /product/3/similars
            url: '/similars',
            templateUrl: './views/similars.html',
            // Get similar products. You can see that we can inject another resolve.
            // In this case it will execute after product promise resolves
            resolve: {
                similarProducts: ['product', 'productSrvc', function (product, productSrvc) {
                    return productSrvc.getSimilars(product.id);
                }]
            },
            controller: ['$scope', 'similarProducts', function ($scope, similarProducts) {
                $scope.similarProducts = similarProducts;
            }]
        });
}]);

// Create product service that will simulate getting data asynchronously from server
app.factory('productSrvc', ['$q', function ($q) {
    var products = [{
        id: 1,
        name: 'Product 1',
        price: 15,
        description: 'Product 1 description Product 1 description Product 1 description Product 1 description/'
    }, {
        id: 2,
        name: 'Product 2',
        price: 23,
        description: 'Product 2 description Product 2 description Product 2 description Product 2 description/'
    }, {
        id: 3,
        name: 'Product 3',
        price: 7,
        description: 'Product 3 description Product 3 description Product 3 description Product 3 description.'
    }];
    
    // methods that simulate async calls using promise library - Q
    // In real case, you will use `$http` service to make ajax calls and retrieve data
    return {
        getAll: function () {
            return $q.when(products);
        },
        
        getById: function (productId) {
            for (var i = 0; i < products.length; i++) {
                if (products[i].id == productId) {
                    return $q.when(products[i]);
                }
            }
        },
        
        getSimilars: function (productId) {
            return $q.when(products.filter(function (product) {
                return product.id != productId;
            }));
        }
    };
}]);