import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import { Document } from 'prismic-javascript/types/documents';
import { client } from "@/lib/prismic";

interface Props {
  product: Document;
}

export default function Product({ product }: Props) {
  const router = useRouter();

  if (router.isFallback) {
    return <p>Carregando...</p>
  }

  return (
    <div>
      <h1>{RichText.asText(product.data.title)}</h1>

      <img src={product.data.thumbnail.url} width="400" alt=""/>

      <div dangerouslySetInnerHTML={{ __html: RichText.asHtml(product.data.description) }} />

      <p>Price: {product.data.price}</p>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const { slug } = context.params;

  const product = await client().getByUID('product', String(slug), {});

  return {
    props: {
      product
    },
    revalidate: 5
  }
}