const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findAll();
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{ model: Product, through: ProductTag, as: 'tag_product'}]
    });

    if (!tagData) {
      res.status(404).json({message: 'No tag found with this id'});
      return;
    }

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  try {
    const tagData = await Tag.create(req.body);
    res.status(200).json(tagData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
  Tag.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
  .then((tag) => {
    return Tag.findAll({where: {tag_id: req.params.id}});
  })
  .then((tagProducts) => {
    const tagProductsIds = tagProducts.map(({product_id}) => product_id);
    const newTagProductTags = req.body.product_id
      .filter((product_id) => !tagProductsIds.includes(product_id))
      .map((product_id) => {
        return {
          tag_id: req.params.id,
          product_id,
          productTag_id,
        };
      });
      const tagProductsToRemove = tagProducts
        .filter(({product_id}) => !req.body.productIds.includes(product_id))
        .map(({ id }) => id);

        return Promise.all([
          tagProducts.destroy({ where: { id: tagProductsToRemove} }),
          tagProducts.bulkCreate(newTagTags),
        ]);
  })
  .then((updatedTagTags) => res.json(updatedTagTags))
  .catch((err) => {
    res.status(400).json(err);
  });
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const tagData = await Tag.destroy({
      where: {
        id: req.params.id
      }
    });
    if (!tagData) {
      res.status(404).json({message: 'No tag found with this id'});
      return;
    }

    res.status(200).json(err);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
