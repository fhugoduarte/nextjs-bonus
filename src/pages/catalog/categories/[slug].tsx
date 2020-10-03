import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from 'next/router';

interface Product {
  id: string;
  title: string;
}

interface Props {
  products: Product[];
}

export default function Top10({ products }: Props) {
  const router = useRouter();

  if (router.isFallback) {
    return <p>Carregando...</p>
  }

  return (
    <div>
      <h1>{router.query.slug}</h1>

      <ul>
          {products.map(product => (
            <li key={`product-${product.id}`}>
              {product.title}
            </li>
          ))}
        </ul>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch(`http://localhost:3333/categories`);
  const categories = await response.json();
0
  const paths = categories.map(category => ({
    params: { slug: category.id }
  }))

  return {
    paths,
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const { slug } = context.params;

  const response = await fetch(`http://localhost:3333/products?category_id=${slug}`);
  const products = await response.json();

  return {
    props: {
      products
    },
    revalidate: 60
  }
}