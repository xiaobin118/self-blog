import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { generateUniqueSlug } from '../utils/slugify.js';
import type { ApiResponse, PaginatedData } from '../types/api.js';

// GET /api/posts
export async function getPosts(req: Request, res: Response) {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
  const tag = req.query.tag as string | undefined;
  const q = req.query.q as string | undefined;

  const where: Record<string, unknown> = { published: true };

  if (q) {
    where.OR = [
      { title: { contains: q } },
      { content: { contains: q } },
    ];
  }

  if (tag) {
    where.tags = { some: { tag: { name: tag } } };
  }

  const [items, total] = await Promise.all([
    prisma.post.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { publishedAt: 'desc' },
      include: {
        tags: { include: { tag: true } },
        author: { select: { id: true, username: true, avatarUrl: true } },
        _count: { select: { comments: true } },
      },
    }),
    prisma.post.count({ where }),
  ]);

  const data: PaginatedData<typeof items[0]> = {
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };

  const response: ApiResponse<PaginatedData<typeof items[0]>> = {
    success: true,
    data,
  };
  res.json(response);
}

// GET /api/posts/:slug
export async function getPostBySlug(req: Request, res: Response) {
  const slug = req.params.slug as string;

  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      tags: { include: { tag: true } },
      author: { select: { id: true, username: true, avatarUrl: true } },
    },
  });

  if (!post) {
    const response: ApiResponse = { success: false, error: 'Post not found' };
    res.status(404).json(response);
    return;
  }

  const response: ApiResponse<typeof post> = { success: true, data: post };
  res.json(response);
}

// POST /api/posts
export async function createPost(req: Request, res: Response) {
  const { title, content, summary, coverImage, published, tags } = req.body;
  const { userId } = req.user!;

  const slug = await generateUniqueSlug(title);

  const post = await prisma.post.create({
    data: {
      slug,
      title,
      content,
      summary,
      coverImage: coverImage ?? null,
      published: published ?? false,
      publishedAt: published ? new Date() : null,
      authorId: userId,
      tags: tags?.length
        ? {
            create: await Promise.all(
              tags.map(async (tagName: string) => {
                const tag = await prisma.tag.upsert({
                  where: { name: tagName },
                  update: {},
                  create: { name: tagName },
                });
                return { tagId: tag.id };
              }),
            ),
          }
        : undefined,
    },
    include: {
      tags: { include: { tag: true } },
      author: { select: { id: true, username: true, avatarUrl: true } },
    },
  });

  const response: ApiResponse<typeof post> = { success: true, data: post };
  res.status(201).json(response);
}

// PUT /api/posts/:id
export async function updatePost(req: Request, res: Response) {
  const id = req.params.id as string;
  const { title, content, summary, coverImage, published, tags } = req.body;

  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) {
    const response: ApiResponse = { success: false, error: 'Post not found' };
    res.status(404).json(response);
    return;
  }

  const slug = title && title !== existing.title
    ? await generateUniqueSlug(title)
    : existing.slug;

  // Update tags if provided
  if (tags) {
    await prisma.postTag.deleteMany({ where: { postId: id } });

    for (const tagName of tags) {
      const tag = await prisma.tag.upsert({
        where: { name: tagName },
        update: {},
        create: { name: tagName },
      });
      await prisma.postTag.create({ data: { postId: id, tagId: tag.id } });
    }
  }

  const post = await prisma.post.update({
    where: { id },
    data: {
      ...(title && { title, slug }),
      ...(content && { content }),
      ...(summary && { summary }),
      ...(coverImage !== undefined && { coverImage }),
      ...(published !== undefined && {
        published,
        publishedAt: published && !existing.published ? new Date() : existing.publishedAt,
      }),
    },
    include: {
      tags: { include: { tag: true } },
      author: { select: { id: true, username: true, avatarUrl: true } },
    },
  });

  const response: ApiResponse<typeof post> = { success: true, data: post };
  res.json(response);
}

// DELETE /api/posts/:id
export async function deletePost(req: Request, res: Response) {
  const id = req.params.id as string;

  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) {
    const response: ApiResponse = { success: false, error: 'Post not found' };
    res.status(404).json(response);
    return;
  }

  await prisma.post.delete({ where: { id } });

  const response: ApiResponse = { success: true, message: 'Post deleted' };
  res.json(response);
}
