var app = angular.module('flapperNews', ['ui.router'])

  // Config
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: '/views/home.html',
        controller: 'MainCtrl',
        resolve: {
          postpromise: ['posts', function(posts) {
            return posts.getAll();
          }],
        }
      })
      .state('posts', {
        url: '/posts/{id}',
        templateUrl: '/views/posts.html',
        controller: 'PostsCtrl'
      })

    $urlRouterProvider.otherwise('/home');
  }])

  // Factory
  .factory('posts', ['$http', function($http) {
    return {
      posts: [],
      getAll: function() {
        var self = this;
        return $http.get('/posts').success(function(data) {
          angular.copy(data, self.posts);
        });
      },
      // create: function() {
      //   return $http.post('/posts').success(function() {

      //   });
      // }
    };
  }])

  // Controller
  .controller('MainCtrl', ['posts', function(posts) {
    var self = this;

    self.posts = posts.posts;

    self.addPost = function() {
      if(!self.title || self.title === '') { return; }
      self.posts.push({title: self.title, link: self.link, upvotes: 4});
      self.title = '';
      self.link = ''
    }

    self.addVote = function(post) {
      post.upvotes += 1;
    }

  }])

  .controller('PostsCtrl', ['$stateParams', 'posts', function ($stateParams, posts) {
    var self = this;

    self.comments = posts.posts[$stateParams.id].comments;

    self.addComment = function() {
      if(self.comment === '') { return; }
      posts.posts[$stateParams.id].comments.push({
        author: 'user',
        body: self.comment,
        upvotes: 1
      })
      self.comment = '';
    }

  }]);