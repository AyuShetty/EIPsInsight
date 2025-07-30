import Link from 'next/link';
import { ArrowLeftIcon } from 'lucide-react';
import { getPostBySlug, PostNotFoundError } from '@/lib/blog';
import { notFound } from 'next/navigation';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { ScrollToHashOnLoad } from '@/components/ScrollToHashOnLoad';
import { Box, Image as ChakraImage } from '@chakra-ui/react';

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let post;
  try {
    post = await getPostBySlug(slug);
  } catch (error) {
    if (error instanceof PostNotFoundError) {
      notFound();
    }
    throw error;
  }

  const { frontmatter, content } = post;

  return (
    <div className='flex flex-col min-h-screen bg-white'>
      <div className='blog-content-wrapper w-full mx-auto mt-12'>
        <Link href='/resources' className='text-blue-600 hover:text-blue-700'>
          <div className='flex items-center gap-2'>
            <ArrowLeftIcon className='w-4 h-4' />
            <span>Back to all blogs</span>
          </div>
        </Link>

        {frontmatter.image && (
          <div className="w-full mt-6 overflow-hidden rounded-lg">
            <Box
              display="flex"
              justifyContent="center"
              my={6}
              px={2}
            >
              <Box
                border="2px solid teal"
                borderRadius="lg"
                overflow="hidden"
                width={{ base: '100%', sm: '90%', md: '80%', lg: '70%' }}
                maxWidth="700px"
                height={{ base: '200px', sm: '250px', md: '350px' }}
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg="gray.50"
              >
                <ChakraImage
                  src={frontmatter.image}
                  alt={frontmatter.title}
                  width="100%"
                  height="100%"
                  objectFit="contain"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    display: 'block'
                  }}
                />
              </Box>
            </Box>
          </div>
        )}

        <div className='w-full mt-6'>
          <h1 className='text-3xl md:text-5xl font-bold mb-2 break-words'>{frontmatter.title}</h1>
          <p className='text-sm text-gray-500 mb-6'>
            Written by {frontmatter.author} on {frontmatter.date.toLocaleDateString()}
          </p>
          <ScrollToHashOnLoad />
          <div className='blog-content-wrapper text-justify'>
            <MarkdownRenderer markdown={content} />
          </div>
        </div>
      </div>
    </div>
  );
}
