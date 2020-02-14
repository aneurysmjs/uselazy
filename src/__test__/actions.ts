interface Action<T> {
  (): {
    type: string;
    payload: T;
  };
}

export const action1: Action<{ price: number }> = () => ({
  type: 'action-1',
  payload: {
    price: 1000,
  },
});

export const action2: Action<{ url: string }> = () => ({
  type: 'action-2',
  payload: {
    url: 'https://site.com',
  },
});
