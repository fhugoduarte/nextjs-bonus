import Prismic from 'prismic-javascript';
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from 'next/router';
import Link from 'next/link';
import { RichText } from 'prismic-dom';
import { Document } from 'prismic-javascript/types/documents';
import { client } from "@/lib/prismic";

interface Props {
  category: Document;
  products: Document[];
}

export default function Top10({ products, category }: Props) {
  const router = useRouter();

  if (router.isFallback) {
    return <p>Carregando...</p>
  }

  return (
    <div>
      <h1>{RichText.asText(category.data.title)}</h1>

      <ul>
          {products.map(product => (
            <li key={`product-${product.id}`}>
              <Link href={`/catalog/products/${product.uid}`}>
                <a>
                  {RichText.asText(product.data.title)}
                </a>
              </Link>
            </li>
          ))}
        </ul>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { results: categories } = await client().query([
    Prismic.Predicates.at('document.type', 'category')
  ]);
0
  const paths = categories.map(category => ({
    params: { slug: category.uid }
  }))

  return {
    paths,
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const { slug } = context.params;

  const category = await client().getByUID('category', String(slug), {});
  const { results: products } = await client().query([
    Prismic.Predicates.at('document.type', 'product'),
    Prismic.Predicates.at('my.product.category', category.id)
  ])

  return {
    props: {
      category,
      products
    },
    revalidate: 60
  }
}