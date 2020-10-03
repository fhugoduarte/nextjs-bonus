import { GetServerSideProps } from 'next';

import { Title } from '@/styles/pages/Home';
import SEO from '@/components/SEO';

interface Product {
  id: string;
  title: string;
}

interface Props {
  recommendedProducts: Product[];
}

export default function Home({ recommendedProducts }: Props) {
  async function handleSum() {
    const { sum } = (await import('@/lib/math')).default;

    alert(sum(3, 5));
  }

  return (
    <div>
      <SEO
        title="DevCommerce, your best e-commerce!"
        image="boost.png"
        shouldExcludeTitleSuffix
      />

      <section>
        <Title>Products</Title>

        <ul>
          {recommendedProducts.map(product => (
            <li key={`product-${product.id}`}>
              {product.title}
            </li>
          ))}
        </ul>
      </section>

      <button onClick={handleSum}>Sum</button>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const response = await fetch(`http://localhost:3333/recommended`);
  const recommendedProducts = await response.json();

  return {
    props: {
      recommendedProducts
    }
  }
}