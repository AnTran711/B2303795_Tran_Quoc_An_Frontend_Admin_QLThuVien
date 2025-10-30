import axios from 'axios';
import { toast } from 'vue3-toastify';
import { useBookStore } from '@/stores/useBookStore';
import { usePublisherStore } from '@/stores/usePublisherStore';
import { useGenreStore } from '@/stores/useGenreStore';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 5000
});

// Axios tự gửi cookie kèm theo request
api.defaults.withCredentials = true;

// có thể set interceptors ở đây nếu cần token
// api.interceptors.request.use(config => {
//   config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
//   return config
// })

api.interceptors.request.use(
  (config) => {
    // set trạng thái loading
    const bookStore = useBookStore();
    const publisherStore = usePublisherStore();
    const genreStore = useGenreStore();
    bookStore.loading = true;
    publisherStore.loading = true;
    genreStore.loading = true;

    return config;
  },
  (error) => {
    // Do something with request error
    const bookStore = useBookStore();
    const publisherStore = usePublisherStore();
    const genreStore = useGenreStore();
    bookStore.loading = false;
    publisherStore.loading = false;
    genreStore.loading = false;
    return Promise.reject(error);
  }
)

api.interceptors.response.use(
  (response) => {
    const bookStore = useBookStore();
    const publisherStore = usePublisherStore();
    const genreStore = useGenreStore();
    bookStore.loading = false;
    publisherStore.loading = false;
    genreStore.loading = false;
    return response;
  },
  (error) => {
    const bookStore = useBookStore();
    const publisherStore = usePublisherStore();
    const genreStore = useGenreStore();
    bookStore.loading = false;
    publisherStore.loading = false;
    genreStore.loading = false;

    let errorMessage = error?.message;
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    
    // Nếu không phải lỗi 410 (hết token) thì toast message
    if (error.response?.status !== 410) {
      toast.error(errorMessage);
    }

    return Promise.reject(error);
  }
)

export default api;
