const bcrypt = require('bcryptjs');
const { initDatabase, run, query } = require('./db');

const seedData = async () => {
  console.log('🌱 Initializing Database Schema...');
  await initDatabase();

  // Clear existing records to ensure idempotent clean seed
  console.log('🧹 Clearing old records...');
  await run('DELETE FROM users');
  await run('DELETE FROM menu_items');
  await run('DELETE FROM orders');
  await run('DELETE FROM reservations');
  await run('DELETE FROM branches');
  await run('DELETE FROM gallery_items');
  await run('DELETE FROM contact_messages');
  await run('DELETE FROM reviews');

  console.log('👤 Seeding Users...');
  const salt = await bcrypt.genSalt(10);
  const adminHash = await bcrypt.hash('admin@secure2026', salt);
  const workerHash = await bcrypt.hash('barista@shift2026', salt);
  const customerHash = await bcrypt.hash('customer123', salt);

  await run(
    `INSERT INTO users (name, email, password_hash, role, avatar_url) VALUES (?, ?, ?, ?, ?)`,
    ['Café Administrator', 'admin@vibescafe.com', adminHash, 'admin', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxIhMDdPwAvDybiBqApXoBFB9OkHy7hm0GIA2ADzDFzKJ2vh9a2Of9CkTcthqUIWOe7NdwKElDPj24E5RgIPK6A4AkemH9PNz4qGSYHBZVr86lYP2VNtkQ-ncgfdFDx4ck0ChNyfTTSLOw7iWdnfmEumYqSULn8-aqJ19h-1LOAWX_OdjZFvSZ3hQSzi_g4qqNWvH5x07iyi1UjbQAwJCa2K_H9uRlDMvViv41OM2_JtPvPJ7hIkgbyg']
  );

  await run(
    `INSERT INTO users (name, email, password_hash, role, avatar_url) VALUES (?, ?, ?, ?, ?)`,
    ['Leo Rossi (Lead Barista)', 'barista@vibescafe.com', workerHash, 'worker', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDV1nlG8MXH5qT1IMpRZaCmHNhD2zjC2ogV9iuACeE7foET7tN85nmeC7eeqbfvHOabzV62Pc3DDLP_L6I1xqh2cQVis1GT2_zOIHx2kVHgrqxg6D1cq2SvUIP8OIX8Ni_Z8uNjOHaIAWr4hk01tSRZ0xLHj5wW_uoSc1Ud4O3gZbrGWWg2_YICzYgJR6ElkxxMLQ72SkrMr-rpsBul66hW1CpsKFlUYR7jQyJLg5IgKaBPPuXQ3J4GuA']
  );

  await run(
    `INSERT INTO users (name, email, password_hash, role, avatar_url) VALUES (?, ?, ?, ?, ?)`,
    ['Jane Doe', 'customer@vibescafe.com', customerHash, 'customer', null]
  );

  console.log('☕ Seeding Menu Items...');
  const menuItems = [
    // Coffee
    {
      name: 'Signature Flat White',
      category: 'Coffee',
      price: 5.00,
      description: 'House blend, silky microfoam, perfectly balanced notes of cocoa and hazelnut.',
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD50YuwoCNWyVtD8Qev0OnQDfe0fJaPmL7OWGQM68HiUmxRNm8sIn2E4v8WLnwX7Bhhbg0OC9TSjPg0SWKWdoIUFX0GrrnUhqjdZZIhHlwtnGePPHvl5MfRvVE3PehQ2wyhTWQjqgUTrMUq9apGYiO_hG795kn9mSqi1EB_P17Brz7VNdlpVwD3uQe_C7farSzH9aDtm5eR3MHA62b0FRclIIeYUTcsD7mOSnlR45PcVpP9d3s4BGbj3A',
      is_vegetarian: 1,
      is_available: 1,
      is_popular: 1
    },
    {
      name: 'House Cappuccino',
      category: 'Coffee',
      price: 4.50,
      description: 'Double shot of our signature espresso blend, perfectly steamed micro-foam milk, finished with a dusting of cocoa.',
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCl4VT6a2EQ0ZddePuSMWIStrUOQNDzfqomf5TMGEVlZWB0oH70XHYgnyX389o7ON6ijMJlduRwMqT9WnxkKCZ3QPRV2GyyYtMbIBU731BnE_NlgwB-4JaalBH6E-sJxziDo9XwuGkRyJhoXfGzvK0xW63q1AIepF0WOOweipWvX23U7b8J42ttt3Ib3arD8a6MiRx3plJeFQ4Dflg4uN_A0RAveMsBS7qVGcOEra5uTgHjqzyzRDcpEw',
      is_vegetarian: 1,
      is_available: 1,
      is_popular: 0
    },
    {
      name: 'Iced Caramel Macchiato',
      category: 'Coffee',
      price: 5.50,
      description: 'Rich espresso poured over cold milk and ice, layered with house-made vanilla syrup and a generous caramel drizzle.',
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCpGcEzMfETxLmwt5xP9dccoZ09Ha0OXVJ6ylGPzfGEijYoXWGaZgAhIe09rW0YMf5uC0ckxXgL_8Lo4TgHOQFcmajgKZImSe78FXx7hWzt_dPFwahjtWfZNopfPvTWv5L223NQEejd-lWvnuogqdyg533Z3Lyj30jpENIhaRWArPGK65P4yStYFxWz29pdIfOnswTAzpKkTsPWlY4PaPV4La9gVHfW2YgBkcMik4P84IMW92qPHn__g',
      is_vegetarian: 1,
      is_available: 1,
      is_popular: 0
    },
    {
      name: 'Single Origin Flat White',
      category: 'Coffee',
      price: 5.00,
      description: 'Rotating single-origin espresso pulled short and sweet, combined with velvety textured milk for a strong, smooth finish.',
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfRqELdM1ibrjU3BmihxnlaNLVUf8yC0gVb2LpCmuHiag4_z-JUQqMkkzd0VVt0AZsPafwY8qx8eQ9X9ABKckTok5jJ2WzNGrHwGGqfUUCRfDDxSvuWtovB8cPg3Usjgh8SNvpnNrartKYkwOMe9Rq8U--E0oz3_dKAC7zax1QEId8pYZnYqQQI_Vjpnz8B3pSHSAJUoHtrxpKYK_d7UqfRQEgs-oxUe5QuVjaebZqHeI7egMTJZYrJw',
      is_vegetarian: 1,
      is_available: 0,
      is_popular: 0
    },
    {
      name: 'Artisanal Pour Over',
      category: 'Coffee',
      price: 4.75,
      description: 'Precision hand-poured seasonal Ethiopian single origin featuring bright floral and bergamot notes.',
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaPEsBM8edOXyJtnN695dVmeUC1rdYJXS1hEkLpyNSuTREm69JdKWwe37gJlSrFFpA1pDKHKM6YRSumt-ZvJ_KhTY-o7mmWbt25XaWyhAhhXi0thx_T30yVgoKdbKgUpX6hXHMsDirkOpBIKY9HiFDD350CUQBQQ9zO2KgkD6qYJCJzmGxK7bblDFPXFynuKQm3U07eHkNiQglaUdc4r7LkpYDudbuQ5clI23DgQh2KuR8Cv1EcOM7aw',
      is_vegetarian: 1,
      is_available: 1,
      is_popular: 0
    },
    // Breakfast
    {
      name: 'Avocado Smash',
      category: 'Breakfast',
      price: 14.00,
      description: 'Sourdough, whipped feta, heirloom tomatoes, soft egg, chili crisp.',
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPK5pndn5m5VxebIAm9uBcr4DNHgbtv4rJPKBx_SVKSjgq-PgEJhKFkXG1cwOSmXB55I9AcBa68VhcnGIgM4DRBfMqlnW9WwJhoptbFqz7AyL1FJbW5l9jbNdZYUA4nNbLYrB78eGJ7jjU9YqBYj-ZEltHbJoJc0McwMfgXd1ObqfB2Aa8JGWQfG-kbGIA4ly6C-5_jsknKd3Wj8EeTUzTXk1OYW84CDRfZ_SdwUv8mJ8G2Vd8njsD8A',
      is_vegetarian: 1,
      is_available: 1,
      is_popular: 1
    },
    {
      name: 'Sunrise Acai Bowl',
      category: 'Breakfast',
      price: 12.00,
      description: 'Organic acai, house granola, seasonal berries, banana, coconut flakes.',
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2RngGbevFqvE_FDJY7F3iAwI7xwPXLWjr8Ga0V6-OzEQzcQKk3EofoXvqSi_EaDgI_jUkRiVP7SqzCrmJrJms5mi0IIODEQutIQ1KpC2vqBAQ6wFvlyS71Piz77zcUjtMrQiYXesqq50rt8twV84ZSDjRL3Ure7a-FAS-TLWwZ5wMAGrV2agc7FvWcXT4_YDhXZ19mMm8gKHbIhYKkTNo8RB9394jwbkDgYLYmPusWOTb30IR19IecA',
      is_vegetarian: 1,
      is_available: 1,
      is_popular: 1
    },
    {
      name: 'Brioche French Toast',
      category: 'Breakfast',
      price: 13.50,
      description: 'Thick-cut golden brioche, pure maple butter, organic berry compote, whipped mascarpone.',
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnjsY5Ou4Bk2sf-O0FcxmD9g5qwzKrQFUGylVGhyFvn39PvMEHvFgRC6VWBu9g98nhVRR3c9gBeiD7MpFOOcBAvw-qPSx-HYvoilrxiR1g0kUizp32WCq72V6DXYLZUSRUmAHgzn_yPd2eklr_fRpjRwRjHmmyep3SSLMDcS38jnY1TfZFBowG7TUapxj6la2Khec1Zpaqik1tFdcq_3yiVd_BPOxShym7R2jHAJZD2tsg4CWoC0uB9w',
      is_vegetarian: 1,
      is_available: 1,
      is_popular: 0
    },
    // Pizza
    {
      name: 'Margherita Rustica',
      category: 'Pizza',
      price: 16.00,
      description: 'San Marzano DOP crushed tomatoes, fior di latte mozzarella, fresh sweet basil, extra virgin olive oil.',
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATRF3MSV6DmrLiqTkW8kTvRefgxcCnR0z0XiN5NiZp0GReQNlwye52x6dY_1BRCb0Z1gplWfQkErxT2okwPysr5H__ZKztodojE_RrPBLHi_C6ixhrn31G46LH2VIp1WFQNKXfTPG7UnQb5wEj7WHeufbCrbjm13swzjhHjXGQwZl7gVIg3kNxT_ucmNT-g1sIAjVdyttR4_D9-0C3jBzjpcRju9gbk-v7TIjMZEzxFa2ebshBYLCDgw',
      is_vegetarian: 1,
      is_available: 1,
      is_popular: 0
    },
    {
      name: 'Wild Forest Truffle Pizza',
      category: 'Pizza',
      price: 18.50,
      description: 'Roasted portobello and cremini mushrooms, smoked provolone, fresh thyme, finished with white truffle drizzle.',
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATRF3MSV6DmrLiqTkW8kTvRefgxcCnR0z0XiN5NiZp0GReQNlwye52x6dY_1BRCb0Z1gplWfQkErxT2okwPysr5H__ZKztodojE_RrPBLHi_C6ixhrn31G46LH2VIp1WFQNKXfTPG7UnQb5wEj7WHeufbCrbjm13swzjhHjXGQwZl7gVIg3kNxT_ucmNT-g1sIAjVdyttR4_D9-0C3jBzjpcRju9gbk-v7TIjMZEzxFa2ebshBYLCDgw',
      is_vegetarian: 1,
      is_available: 1,
      is_popular: 0
    },
    // Pasta
    {
      name: 'Truffle Tagliatelle',
      category: 'Pasta',
      price: 18.50,
      description: 'Handcrafted ribbon pasta in a velvety black truffle and aged Parmigiano Reggiano butter sauce.',
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPK5pndn5m5VxebIAm9uBcr4DNHgbtv4rJPKBx_SVKSjgq-PgEJhKFkXG1cwOSmXB55I9AcBa68VhcnGIgM4DRBfMqlnW9WwJhoptbFqz7AyL1FJbW5l9jbNdZYUA4nNbLYrB78eGJ7jjU9YqBYj-ZEltHbJoJc0McwMfgXd1ObqfB2Aa8JGWQfG-kbGIA4ly6C-5_jsknKd3Wj8EeTUzTXk1OYW84CDRfZ_SdwUv8mJ8G2Vd8njsD8A',
      is_vegetarian: 1,
      is_available: 1,
      is_popular: 0
    },
    {
      name: 'Rigatoni al Pomodoro',
      category: 'Pasta',
      price: 15.00,
      description: 'Slow simmered San Marzano tomatoes, garlic confit, topped with fresh stracciatella and basil.',
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPK5pndn5m5VxebIAm9uBcr4DNHgbtv4rJPKBx_SVKSjgq-PgEJhKFkXG1cwOSmXB55I9AcBa68VhcnGIgM4DRBfMqlnW9WwJhoptbFqz7AyL1FJbW5l9jbNdZYUA4nNbLYrB78eGJ7jjU9YqBYj-ZEltHbJoJc0McwMfgXd1ObqfB2Aa8JGWQfG-kbGIA4ly6C-5_jsknKd3Wj8EeTUzTXk1OYW84CDRfZ_SdwUv8mJ8G2Vd8njsD8A',
      is_vegetarian: 1,
      is_available: 1,
      is_popular: 0
    },
    // Desserts
    {
      name: 'Artisan Cinnamon Cardamom Bun',
      category: 'Desserts',
      price: 4.50,
      description: 'Baked fresh every morning with browned butter, crushed cardamom seeds, and Ceylon cinnamon glaze.',
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEK3GWXu__fLuNt1FQ-NVuCO37Cua_Jk8tiLeXgzRK6-yIx2r7KAW49NpQAN6cUSEaD497Z8D4WhbNzQ3UVJS5RHBizGVWfrIRXAizzQI-IAMIAJBsPf7uQ1Mzc1tiHg_57AeLoMP3_nUhJm9ug4CbHM6xpYSOcUmXRMKLXl7ZcPdR3cmNB7aBsvmw3UWPmh4GuO32OsntEYFY-KclISGz-4b6oG2lHFRTuFvwKwnADDZDhe9HayBZZg',
      is_vegetarian: 1,
      is_available: 1,
      is_popular: 0
    },
    {
      name: 'Basque Burnt Cheesecake',
      category: 'Desserts',
      price: 7.00,
      description: 'Fluffy baked cheesecake with a dark caramelized exterior and silky custard interior.',
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEK3GWXu__fLuNt1FQ-NVuCO37Cua_Jk8tiLeXgzRK6-yIx2r7KAW49NpQAN6cUSEaD497Z8D4WhbNzQ3UVJS5RHBizGVWfrIRXAizzQI-IAMIAJBsPf7uQ1Mzc1tiHg_57AeLoMP3_nUhJm9ug4CbHM6xpYSOcUmXRMKLXl7ZcPdR3cmNB7aBsvmw3UWPmh4GuO32OsntEYFY-KclISGz-4b6oG2lHFRTuFvwKwnADDZDhe9HayBZZg',
      is_vegetarian: 1,
      is_available: 1,
      is_popular: 0
    },
    // Beverages
    {
      name: 'Matcha Lavender Latte',
      category: 'Beverages',
      price: 6.00,
      description: 'Ceremonial grade Uji matcha whisked with lavender syrup and creamy oat milk.',
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCpGcEzMfETxLmwt5xP9dccoZ09Ha0OXVJ6ylGPzfGEijYoXWGaZgAhIe09rW0YMf5uC0ckxXgL_8Lo4TgHOQFcmajgKZImSe78FXx7hWzt_dPFwahjtWfZNopfPvTWv5L223NQEejd-lWvnuogqdyg533Z3Lyj30jpENIhaRWArPGK65P4yStYFxWz29pdIfOnswTAzpKkTsPWlY4PaPV4La9gVHfW2YgBkcMik4P84IMW92qPHn__g',
      is_vegetarian: 1,
      is_available: 1,
      is_popular: 0
    },
    {
      name: 'Cold-Pressed Sunshine Juice',
      category: 'Beverages',
      price: 6.50,
      description: 'Fresh Valencia orange, turmeric root, ginger, and crisp Fuji apple.',
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCpGcEzMfETxLmwt5xP9dccoZ09Ha0OXVJ6ylGPzfGEijYoXWGaZgAhIe09rW0YMf5uC0ckxXgL_8Lo4TgHOQFcmajgKZImSe78FXx7hWzt_dPFwahjtWfZNopfPvTWv5L223NQEejd-lWvnuogqdyg533Z3Lyj30jpENIhaRWArPGK65P4yStYFxWz29pdIfOnswTAzpKkTsPWlY4PaPV4La9gVHfW2YgBkcMik4P84IMW92qPHn__g',
      is_vegetarian: 1,
      is_available: 1,
      is_popular: 0
    }
  ];

  for (const item of menuItems) {
    await run(
      `INSERT INTO menu_items (name, category, price, description, image_url, is_vegetarian, is_available, is_popular)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [item.name, item.category, item.price, item.description, item.image_url, item.is_vegetarian, item.is_available, item.is_popular]
    );
  }

  console.log('📍 Seeding Branches...');
  const branches = [
    {
      name: 'Downtown Roastery',
      district: 'Downtown',
      address: '120 Main Street, Metropolis, NY 10001',
      phone: '(555) 123-4567',
      hours: 'Mon-Sun: 7am - 8pm',
      status: 'Open Now',
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_-VtQ5phWOPqTpxhg5Ur_h2Qyk-unFR8pVGx3-JzlBOvBhoGCjxLF1iYJLUsf5cueweJeL7HDPHL9RbGtPTB1UKf3OPvgz2Q8egKUEyQlLVGf9s7RwQ2DW8TfYhyIwtjGP3gB5_puXFQyDy6KVL58cOqCZIaYeWFN12sIx4GcRepj7tWQjj2w2NMhw1ZPzNZGFgFqJevDGvXhGTfi3MBczMcEiTKRe2qd0f101ozZNJSXRdkXobAlaw',
      map_image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrVsvXTB4U62cVx0wRemMZEKT5i3156Q92XQ3NJCT8pgqv1MD92TH6CWDLUWKIUWkB3roKErt8InHK4CWlM7HhKtQCQ3Hl4PjM5ipazisQeY8UAQ0v0o_Jaw2mngqRThARJzKdehkVJ9e6orYnm8uM6GVU4ePPR476vH7WXVQStFF6eC190vp4DAhx9XQfC9JfsWHMpvBxZ5R0a-NAwOwkqyaQ6Kl1eviJ0uNFhzo8CkPCoj_XOWPvMQ'
    },
    {
      name: 'Westside Commons',
      district: 'Westside',
      address: '450 West Avenue, Metropolis, NY 10012',
      phone: '(555) 987-6543',
      hours: 'Mon-Sat: 6am - 6pm • Sun: 8am - 4pm',
      status: 'Closes soon',
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQxNIYlA0HwuJtTTsW4qRKjYY58SBYaMpTqzq7u1DdJYU1CU-I47-V9nVPY3v6A3hHCzn60-etaULTVnV4oiqjdcAlGlk321LjH1lS9-17BtbVg8GOt0UK9i-hssQEvpYRatYtwoznvEqoyrB3Xz9fqMqz_vkz2d5o5W2wAEjw_3c53o4XxXA_D-bwa617_C-MNWYxoM78_6dOK5N1GP4YSMJQ5fePUcKnfKeCffHGN67NJixdZoyrZQ',
      map_image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCuwe1vI0fxQAL3FwjBgGAiVW0l8dkyEltrgMP6WIYNKzDKAjbVEboph6aWHhP0zVdR4BwnZsI_zwUdvPn5baL2-aabw-aK21oIXV9QgB8x9mET2qK9L9m5vBVU61Po27KNguPng8YKFh8XlaBuxVgy2Ox2n19xegzUXhQpxXGXK6wiBd4zV7Bg6RGHqEri0qKDLLV2Qn1X3smZJiOsaOwsG8kYohTDekuN1bUqO14xlfxINVC5q8wiw'
    },
    {
      name: 'North District',
      district: 'North District',
      address: '88 Park Blvd, Metropolis, NY 10024',
      phone: '(555) 321-0987',
      hours: 'Mon-Sun: 7am - 9pm',
      status: 'Open Now',
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBn5LSScCwJhx4Zvm-COIQErAXYfaz7NyqhjXQhDMzt_ToCKzlAQYRuHP5erEYYAYUDRSg94kBH05dYoRQGyIEIQU8RzVxGFPLNyqIXrRFvclrvXlDYniy3TfQYpSv0AW6hXEAIeFd3NYc_Kc6ykwvlppu9dyLiKeyYQyfXir55yaWhGbvbiARrlAPCykSG98_U_3zgcb6a2nNPq_WGMlbnvAsXEwCKEGe90EgSqJHJxUgsAby7bEumXg',
      map_image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxVnIJq3KrEqnpMyw39T-2BbYs67zTUgvYRmPtgVSImT4vLGHWLfkclPW0aYgL13AAwLz0fkjcZ_8JU-HsTh3ViW76G-ZXOTAADolIUywnwJOriZHfcuHL9G1SgeJ7Qvyj6lD01eC6w1sGN5z6EZmRKbJgSjnW-tFOsuHy7bojNMmzeMFdbSlW8-Jry91oiNI3wVy4XQdKhkrv9genTX2b68Y5AcF-c427WbMmgS4VPU7pfFiFQ36tfQ'
    }
  ];

  for (const b of branches) {
    await run(
      `INSERT INTO branches (name, district, address, phone, hours, status, image_url, map_image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [b.name, b.district, b.address, b.phone, b.hours, b.status, b.image_url, b.map_image_url]
    );
  }

  console.log('🖼️ Seeding Gallery...');
  const gallery = [
    {
      title: 'Morning Rituals',
      subtitle: 'Perfect pours to start the day.',
      category: 'FOOD',
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhiOJUexeo6H46Z0CMuJ7_3lv6qUPa-LgJY-9r-qUlUxdvK4C2e2Gh8PzZCV2YFP8_0eI2mBjpTucne4WJRVU04WCfUQ-rI-v3WVSfqwpHExcEUcaU3UBng6TMnfWlOMVBvJLH70P9OIVeFx6mhJo4weoeOuUfOcKH913IGs-WQouyGnBtyDzKy2yedNhjn9K4Arg5PMEmvkZuCw8b2XEl67tcfebB8684tqmd2j-EbNgJ7rrfqI4AHQ'
    },
    {
      title: 'The Atmosphere',
      subtitle: 'A space designed for connection.',
      category: 'CAFÉ',
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWjcOLMfNDBN4ROtWLwTVXNMxOw_vU5NEFVQYIVX4TNmA22mTkUrqBVSnKa1BG0xqQOt1W7SGS74IsbX6fW9UEBDLqfrX4PWn6wfiheCFocHaGDY4BKh8UJWH76aMbAH69KMa7Us9PmhhqhXOsMP2WGCNZ1OHIc1evgjdSFoLisXWJGAYMSr8_T1M3lmiZ6rdDqlPBkYEFgtGk3yBRKXO9jrncn-vI8PdVaLZ32JszQEIurOfAy3D_pg'
    },
    {
      title: 'The Craft',
      subtitle: 'Dedicated to the perfect cup.',
      category: 'PEOPLE',
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0BrB5pLvtagYYYnYaw6_nEBvfUUHZSyjKo-4lbT1gR9rRHfCp89yc8O559RPxSJe8Mbr9uNw1Zy7BeUkiiKx58zjYDN5vO7T4h1Hb1dIpbcblBDBwgZW0p8SEOpzlKX1H4AylMDv_3sm-_x8Xx4EimzZcJol7Pzs1GcUqiKsT6oB-dwdOaeBnmpuyqDCjEhtqDwZ2xaCbcFyZYm46xYjHD4TmzbSPXNXA2MWBD0CI83BetB_DiQ1REg'
    },
    {
      title: 'Fresh & Local',
      subtitle: 'Seasonal ingredients on toast.',
      category: 'FOOD',
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATRF3MSV6DmrLiqTkW8kTvRefgxcCnR0z0XiN5NiZp0GReQNlwye52x6dY_1BRCb0Z1gplWfQkErxT2okwPysr5H__ZKztodojE_RrPBLHi_C6ixhrn31G46LH2VIp1WFQNKXfTPG7UnQb5wEj7WHeufbCrbjm13swzjhHjXGQwZl7gVIg3kNxT_ucmNT-g1sIAjVdyttR4_D9-0C3jBzjpcRju9gbk-v7TIjMZEzxFa2ebshBYLCDgw'
    },
    {
      title: 'Live Acoustics',
      subtitle: 'Friday night gatherings.',
      category: 'EVENTS',
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9sKpUa_GP5fv0YbJ6DZIcbIgJUVzR3cD1YYoXaGvPqpfmoAMI1SRjfHvmMm1n8uuu2jdHLz_XFI7ZaO4q1iFJTZaqxLZX5bMbp3HH9oGLiowl5Q3k0T0rs4MyEps0ClVp0dbS1E7tvSKE-D7-ueoJOU9v1Zi2M956lIusbQ6dWfvPvzgz90P4VDxT1om1oyuAMCopFp0QimaGlAMstQhCgmzGh0IKMPFPNwEu_dpRq5C8TQLrTA1o8Q'
    },
    {
      title: 'Neighborhood Corner',
      subtitle: 'Your local escape.',
      category: 'CAFÉ',
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgJ9QVURvN-fvnZzZ1ejBC0XWDMFWdnRA1AVHCAUJSVZoXkuUJjXfvcRaNEUg9d5aGOYimxcd-1pQjyoR8cqPO6qvG1bRbpHR2uwdumsPFaR2Jn2VVEn9BWSRdtCNEXBG86dUAQwBWcE9FvBBD1vdc41qpkXY0eXUD4OxOsFCuvZnHBqQc50mKWPAIeOuVL9g3eRfd8K6n6yd2j0wl3xq3gTj0NCSpbiEynEohP5m90bxA1lePNmOtuQ'
    }
  ];

  for (const g of gallery) {
    await run(
      `INSERT INTO gallery_items (title, subtitle, category, image_url) VALUES (?, ?, ?, ?)`,
      [g.title, g.subtitle, g.category, g.image_url]
    );
  }

  console.log('📋 Seeding Orders...');
  const orders = [
    {
      order_number: 'VC-4829',
      customer_name: 'Jane Doe',
      customer_email: 'jane@example.com',
      order_type: 'dine-in',
      table_number: 'Table 4',
      items: [
        { name: 'Avocado Smash', quantity: 1, price: 14.00 },
        { name: 'Matcha Lavender Latte', quantity: 2, price: 6.00 },
        { name: 'Truffle Tagliatelle', quantity: 1, price: 16.50 }
      ],
      total_amount: 42.50,
      status: 'preparing'
    },
    {
      order_number: 'VC-4828',
      customer_name: 'Michael Smith',
      customer_email: 'mike@example.com',
      order_type: 'takeaway',
      table_number: null,
      items: [
        { name: 'Signature Flat White', quantity: 2, price: 5.00 },
        { name: 'Artisan Cinnamon Cardamom Bun', quantity: 2, price: 4.00 }
      ],
      total_amount: 18.00,
      status: 'completed'
    },
    {
      order_number: 'VC-4827',
      customer_name: 'Amanda Lee',
      customer_email: 'amanda@example.com',
      order_type: 'dine-in',
      table_number: 'Table 8',
      items: [
        { name: 'Truffle Tagliatelle', quantity: 2, price: 18.50 },
        { name: 'House Cappuccino', quantity: 2, price: 4.50 },
        { name: 'Basque Burnt Cheesecake', quantity: 1, price: 9.20 }
      ],
      total_amount: 55.20,
      status: 'completed'
    },
    {
      order_number: 'VC-1042',
      customer_name: 'Sarah Jenkins',
      customer_email: 'sarah.j@example.com',
      order_type: 'dine-in',
      table_number: 'Table 12',
      items: [
        { name: 'Artisanal Pour Over', quantity: 2, price: 4.75 },
        { name: 'Avocado Smash', quantity: 1, price: 14.00 }
      ],
      total_amount: 23.50,
      status: 'pending'
    },
    {
      order_number: 'VC-1043',
      customer_name: 'Alex Rivera',
      customer_email: 'alex.r@example.com',
      order_type: 'takeaway',
      table_number: null,
      items: [
        { name: 'Iced Caramel Macchiato', quantity: 1, price: 5.50 },
        { name: 'Artisan Cinnamon Cardamom Bun', quantity: 1, price: 4.50 }
      ],
      total_amount: 10.00,
      status: 'pending'
    }
  ];

  for (const o of orders) {
    await run(
      `INSERT INTO orders (order_number, customer_name, customer_email, order_type, table_number, items_json, total_amount, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [o.order_number, o.customer_name, o.customer_email, o.order_type, o.table_number, JSON.stringify(o.items), o.total_amount, o.status]
    );
  }

  console.log('📅 Seeding Reservations...');
  const reservations = [
    {
      customer_name: 'Sarah Jenkins',
      customer_email: 'sarah@example.com',
      customer_phone: '(555) 234-5678',
      branch_name: 'Downtown Roastery',
      table_info: 'Table 4 (Window)',
      guests: 2,
      reservation_date: 'Today',
      reservation_time: '12:30 PM',
      status: 'active',
      notes: 'Window preference requested.'
    },
    {
      customer_name: 'David Chen',
      customer_email: 'david@example.com',
      customer_phone: '(555) 345-6789',
      branch_name: 'Downtown Roastery',
      table_info: 'Table 12 (Patio)',
      guests: 4,
      reservation_date: 'Today',
      reservation_time: '1:00 PM',
      status: 'active',
      notes: 'Outdoor seating.'
    },
    {
      customer_name: 'Emma Watson',
      customer_email: 'emma@example.com',
      customer_phone: '(555) 456-7890',
      branch_name: 'Westside Commons',
      table_info: 'Table 2 (Booth)',
      guests: 2,
      reservation_date: 'Today',
      reservation_time: '1:45 PM',
      status: 'active',
      notes: 'Celebrating anniversary.'
    },
    {
      customer_name: 'Michael Chang',
      customer_email: 'michael.c@example.com',
      customer_phone: '(555) 567-8901',
      branch_name: 'North District',
      table_info: 'Table 04',
      guests: 4,
      reservation_date: 'Today',
      reservation_time: '11:00 AM',
      status: 'active',
      notes: 'Corner table if possible.'
    }
  ];

  for (const r of reservations) {
    await run(
      `INSERT INTO reservations (customer_name, customer_email, customer_phone, branch_name, table_info, guests, reservation_date, reservation_time, status, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [r.customer_name, r.customer_email, r.customer_phone, r.branch_name, r.table_info, r.guests, r.reservation_date, r.reservation_time, r.status, r.notes]
    );
  }

  console.log('✉️ Seeding Contact Messages...');
  await run(
    `INSERT INTO contact_messages (name, email, subject, message, is_read)
     VALUES (?, ?, ?, ?, ?)`,
    ['Eleanor Vance', 'eleanor@example.com', 'Private Event Inquiry', 'Hello! We would love to host a small acoustic gathering for 20 people at your Downtown Roastery next month. Could you share your catering packages?', 0]
  );

  console.log('⭐ Seeding Reviews & Complaints...');
  const sampleReviews = [
    {
      author_name: 'Sophia Martinez',
      type: 'review',
      rating: 5,
      title: 'Best Flat White in Town!',
      message: 'The microfoam texture and espresso extraction at the Downtown branch is unbelievable. Pair it with the avocado smash for the ultimate morning vibe!',
      is_visible: 1,
      is_resolved: 1,
      staff_response: 'Thank you so much Sophia! Leo and the team take great pride in our extraction technique.'
    },
    {
      author_name: 'David Chen',
      type: 'complaint',
      rating: null,
      title: 'Long Wait Time During Peak Rush',
      message: 'Visited around 8:30 AM yesterday and waited almost 15 minutes for my pour-over coffee. The staff was polite, but extra baristas would help during rush hours.',
      is_visible: 1,
      is_resolved: 1,
      staff_response: 'We apologize for the delay David! We have added an extra barista shift during the 8:00 - 9:30 AM peak morning window.'
    },
    {
      author_name: 'Emily Watson',
      type: 'suggestion',
      rating: null,
      title: 'Oat Milk Option & Vegan Pastries',
      message: 'Would love to see more vegan pastry items on the menu like a vegan cinnamon roll or matcha loaf to go with oat milk coffees!',
      is_visible: 1,
      is_resolved: 0,
      staff_response: null
    }
  ];

  for (const r of sampleReviews) {
    await run(
      `INSERT INTO reviews (author_name, type, rating, title, message, is_visible, is_resolved, staff_response)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [r.author_name, r.type, r.rating, r.title, r.message, r.is_visible, r.is_resolved, r.staff_response]
    );
  }

  console.log('✨ Seed completed successfully!');
};

if (require.main === module) {
  seedData()
    .then(() => {
      console.log('🎉 Done.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Error seeding database:', err);
      process.exit(1);
    });
}

module.exports = seedData;
