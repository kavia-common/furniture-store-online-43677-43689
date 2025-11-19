const products = [
  {
    id: '1',
    name: 'Nordic Oak Chair',
    image: '/assets/chair-oak.jpg',
    category: 'Chairs',
    price: 129.9,
    rating: 4.5,
    material: 'Oak',
    featured: true,
    shortDesc: 'Smooth lines and sustainable wood for your dining room.',
    specs: {
      width: '52cm', height: '82cm', depth: '57cm', color: 'Natural Oak'
    }
  },
  {
    id: '2',
    name: 'Aurora Velvet Sofa',
    image: '/assets/sofa-velvet.jpg',
    category: 'Sofas',
    price: 899,
    rating: 4.9,
    material: 'Velvet',
    featured: true,
    shortDesc: 'Luxurious plush velvet with modern curves.',
    specs: {
      width: '210cm', height: '90cm', depth: '98cm', color: 'Royal Blue'
    }
  },
  {
    id: '3',
    name: 'Tide Glass Coffee Table',
    image: '/assets/coffee-glass.jpg',
    category: 'Tables',
    price: 249.99,
    rating: 4.7,
    material: 'Glass',
    featured: false,
    shortDesc: 'Minimalist glass and steel for a modern living space.',
    specs: {
      width: '110cm', height: '42cm', depth: '60cm', color: 'Clear/Matte Black'
    }
  },
  {
    id: '4',
    name: 'Cove Rattan Armchair',
    image: '/assets/rattan-armchair.jpg',
    category: 'Chairs',
    price: 175.5,
    rating: 4.3,
    material: 'Rattan',
    featured: false,
    shortDesc: 'Laid-back coastal rattan paired with cozy seating.',
    specs: {
      width: '60cm', height: '79cm', depth: '63cm', color: 'Natural/Tan'
    }
  },
  // Add more mock items as needed
];

export default products;
