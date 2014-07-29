console.log(
  require('./lambdas.ms').render({
    name: 'Jess',
    attr: function(attr) {
      return '' + attr + '="{{name}}"';
    }
  })
);
