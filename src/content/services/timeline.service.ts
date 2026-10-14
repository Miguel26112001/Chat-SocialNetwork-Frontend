import { MOCK_COMMENTS, MOCK_POSTS } from '../mock/timeline.mock';
import type { Post, PostComment } from '../model/post.entity';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Servicio del timeline.
 * DEMO: opera sobre datos mock en memoria con la misma firma que tendrá
 * el servicio real (GET timeline, POST likes, POST comments). Al llegar
 * el backend, solo se reescribe el interior contra httpInstance.
 */
class TimelineService {
  private posts: Post[] = MOCK_POSTS.map((post) => ({ ...post }));

  async getTimeline(): Promise<Post[]> {
    await delay(500);
    return this.posts.map((post) => ({ ...post }));
  }

  async toggleLike(postId: string): Promise<Post | null> {
    await delay(150);
    const post = this.posts.find((item) => item.id === postId);
    if (!post) {
      return null;
    }
    post.likedByMe = !post.likedByMe;
    post.likeCount += post.likedByMe ? 1 : -1;
    return { ...post };
  }

  async getComments(postId: string): Promise<PostComment[]> {
    await delay(300);
    return [...(MOCK_COMMENTS[postId] ?? [])];
  }

  async addComment(postId: string, author: Post['author'], content: string): Promise<PostComment> {
    await delay(200);
    const comment: PostComment = {
      id: `c-${Date.now()}`,
      author,
      content,
      createdAt: new Date().toISOString()
    };
    const list = MOCK_COMMENTS[postId] ?? [];
    list.push(comment);
    MOCK_COMMENTS[postId] = list;
    const post = this.posts.find((item) => item.id === postId);
    if (post) {
      post.commentCount += 1;
    }
    return comment;
  }

  async publish(author: Post['author'], content: string): Promise<Post> {
    await delay(300);
    const post: Post = {
      id: `post-${Date.now()}`,
      author,
      content,
      visibility: 'PUBLIC',
      likeCount: 0,
      commentCount: 0,
      likedByMe: false,
      createdAt: new Date().toISOString()
    };
    this.posts.unshift(post);
    return { ...post };
  }
}

export const timelineService = new TimelineService();
