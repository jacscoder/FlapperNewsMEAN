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
        controller: 'PostsCtrl',
        resolve: {
          post: ['$stateParams', 'posts', function($stateParams, posts) {
            return posts.get($stateParams.id);
          }]
        }
      })

    $urlRouterProvider.otherwise('/home');
  }])

  // Factory
  .factory('posts', ['$http', function($http) {
    return {
      posts: [],
      post: null,
      getAll: function() {
        var self = this;
        return $http.get('/posts').success(function(data) {
          angular.copy(data, self.posts);
        });
      },
      create: function(post) {
        var self = this;
        return $http.post('/posts', post).success(function(data) {
          self.posts.push(data);
        });
      },
      upvote: function(post) {
        var self = this;
        return $http.put('/posts/' + post._id + '/upvote').success(function(data) {
            post.upvotes += 1;
          });
      },
      get: function(id) {
        var self = this;
        return $http.get('/posts/' + id).then(
          function(res) {
            self.post = res.data;
            console.log(self.post);
            return res.data;
          },
          function(res) {
            console.log('Unable yo get the post');
          });
      },
    };
  }])

  // Controller
  .controller('MainCtrl', ['posts', function(posts) {
    var self = this;

    self.posts = posts.posts;

    self.addPost = function() {
      if(!self.title || self.title === '') { return; }

      posts.create({
        title: self.title,
        link: self.link,
      });

      self.title = '';
      self.link = ''
    }

    self.addVote = function(post) {
      posts.upvote(post);
      // post.upvotes += 1;
    }

  }])

  .controller('PostsCtrl', ['$stateParams', 'posts', function ($stateParams, posts) {
    var self = this;

    self.comments = posts.post.comments;
    // self.comments = post.comments;

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