import Prismic from 'prismic-javascript';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { RichText } from 'prismic-dom';
import { Document } from 'prismic-javascript/types/documents';

import { Title } from '@/styles/pages/Home';
import SEO from '@/components/SEO';
import { client } from '@/lib/prismic';

interface Props {
  recommendedProducts: Document[];
}

export default function Home({ recommendedProducts }: Props) {
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
              <Link href={`/catalog/products/${product.uid}`}>
                <a>
                  {RichText.asText(product.data.title)}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const { results: recommendedProducts } = await client().query([
    Prismic.Predicates.at('document.type', 'product')
  ]);

  return {
    props: {
      recommendedProducts
    }
  }
}