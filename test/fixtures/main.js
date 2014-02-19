console.log(
  require('./template.ms').render({name: 'Dave'}, {foo: require('./foo.ms')})
);
