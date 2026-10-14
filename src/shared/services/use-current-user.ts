import { ref } from 'vue';
import { UserService } from '@/iam/services/user.service';
import type { User } from '@/iam/model/user.entity';

const userService = new UserService();
const cachedUser = ref<User | null>(null);
const loaded = ref(false);
let pending: Promise<User | null> | null = null;

/**
 * Usuario actual con caché en memoria (evita pedir /users/me en cada
 * vista del layout). Llamar a refresh() tras login/logout.
 */
export function useCurrentUser() {
  async function load(): Promise<User | null> {
    if (loaded.value) {
      return cachedUser.value;
    }
    if (!pending) {
      pending = userService
        .getMe()
        .then((user) => {
          cachedUser.value = user;
          loaded.value = true;
          return user;
        })
        .catch(() => {
          loaded.value = true;
          return null;
        })
        .finally(() => {
          pending = null;
        });
    }
    return pending;
  }

  function refresh(): void {
    cachedUser.value = null;
    loaded.value = false;
    pending = null;
  }

  return { user: cachedUser, load, refresh };
}
