/**
 * Autor de una publicación (proyección mínima de perfil).
 */
export interface PostAuthor {
  username: string;
  displayName: string;
}

/**
 * Publicación del timeline.
 * Espejo de content.posts (+ post_media y conteo de engagement).
 */
export interface Post {
  id: string;
  author: PostAuthor;
  content: string;
  imageUrl?: string;
  visibility: 'PUBLIC' | 'FOLLOWERS' | 'PRIVATE';
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
  createdAt: string;
}

/**
 * Comentario de una publicación.
 * Espejo de engagement.comments (sin anidado en esta vista).
 */
export interface PostComment {
  id: string;
  author: PostAuthor;
  content: string;
  createdAt: string;
}
