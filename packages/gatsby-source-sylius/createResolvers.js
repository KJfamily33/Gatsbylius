const { createRemoteFileNode } = require(`gatsby-source-filesystem`);

module.exports = ({
  actions,
  cache,
  createNodeId,
  createResolvers,
  store,
  reporter,
  getNode,
}) => {
  const { createNode } = actions;

  createResolvers({
    Product: {
      localImage: {
        resolve: source =>
          source.firstImage
            ? createRemoteFileNode({
                url: source.firstImage,
                store,
                cache,
                createNode,
                createNodeId,
                reporter,
              })
            : null,
      },
    },
    Category: {
      localImage: {
        resolve: source =>
          source.categoryImage
            ? createRemoteFileNode({
                url: source.categoryImage,
                store,
                cache,
                createNode,
                createNodeId,
                reporter,
              })
            : null,
      },
      parent: {
        resolve: source =>
          source.parentCategory
            ? getNode(createNodeId(`category-${source.parentCategory}`))
            : null,
      },
      children: {
        resolve: source =>
          source.subcategories
            ? source.subcategories.map(categoryCode =>
                getNode(createNodeId(`category-${categoryCode}`))
              )
            : null,
      },
      products: {
        resolve: (source, _, context) =>
          source.fields && source.fields.products
            ? source.fields.products.map(productCode =>
                context.nodeModel.getNodeById({
                  id: createNodeId(`product-${productCode}`),
                })
              )
            : [],
      },
    },
  });
};
