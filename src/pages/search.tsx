import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { Document } from 'prismic-javascript/types/documents';
import { GetServerSideProps } from "next";
import Link from 'next/link';
import Prismic from 'prismic-javascript';
import { RichText } from 'prismic-dom';
import { client } from "@/lib/prismic";

interface Props {
  searchResults: Document[];
}

export default function Search({ searchResults }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState('');

  function handleSearch(e: FormEvent) {
    e.preventDefault();

    router.push(`/search?q=${encodeURIComponent(search)}`);

    setSearch('');
  }

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}/>
        <button type="submit">Search</button>
      </form>

      <ul>
        {searchResults.map(product => (
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

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const { q } = context.query;

  if (!q) {
    return {
      props: {
        searchResults: []
      }
    }
  }

  const {results: searchResults} = await client().query([
    Prismic.Predicates.at('document.type', 'product'),
    Prismic.Predicates.fulltext('my.product.title', String(q)),
  ])

  return {
    props: {
      searchResults
    }
  }
}