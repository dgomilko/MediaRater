get_reviews = lambda src: [{
      'text': r.text,
      'rate': r.rate,
      'author': r.user.name,
      'author_id': r.user_id,
      'product': r.product.product.title,
      'product_id': r.product_id
    } for r in src]
