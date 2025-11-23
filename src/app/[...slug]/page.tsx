"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';

interface DynamicPageData {
  _id: string;
  title: string;
  slug: string;
  pageTitle?: string;
  heroImage?: string;
  pageContent?: string;
  content?: string;
  pageDescription?: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  isActive: boolean;
}

export default function DynamicPage() {
  const params = useParams();
  const [pageData, setPageData] = useState<DynamicPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPageData = async () => {
      if (!params.slug) return;
      
      const slug = Array.isArray(params.slug) ? params.slug.join('/') : params.slug;
      
      try {
        const response = await fetch(`/api/dynamic-pages/slug/${slug}`);
        const result = await response.json();
        
        if (result.success && result.data) {
          setPageData(result.data);
        } else {
          setError('Page not found');
        }
      } catch {
        setError('Failed to load page');
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
          <p className="text-gray-600 mb-4">{error || 'Page not found'}</p>
          <Link href="/" className="text-green-600 hover:underline">Go back to home</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{pageData.metaTitle || pageData.pageTitle || pageData.title}</title>
        <meta name="description" content={pageData.metaDescription || pageData.pageDescription || pageData.description} />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
        {pageData.heroImage && (
          <div className="mb-8">
            <Image
              src={pageData.heroImage}
              alt={pageData.pageTitle || pageData.title}
              width={800}
              height={400}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {pageData.pageTitle || pageData.title}
          </h1>
          
          {(pageData.pageDescription || pageData.description) && (
            <p className="text-gray-600 mb-6 text-lg">
              {pageData.pageDescription || pageData.description}
            </p>
          )}
          
          <div 
            className="prose max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ 
              __html: pageData.pageContent || pageData.content || '' 
            }}
          />
          </div>
        </div>
      </div>
    </>
)}