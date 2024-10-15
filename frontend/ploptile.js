module.exports = function (plop) {
    plop.setGenerator('component', {
      description: 'Generar un nuevo componente',
      prompts: [
        {
          type: 'input',
          name: 'name',
          message: 'Nombre del componente:',
        },
      ],
      actions: [
        {
          type: 'add',
          path: 'src/components/{{pascalCase name}}.tsx',
          templateFile: 'plop-templates/Component.tsx.hbs',
        },
      ],
    });
  };