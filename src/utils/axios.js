import axios from 'axios';
import { toast } from 'vue3-toastify';
import { useBookStore } from '@/stores/useBookStore';
import { usePublisherStore } from '@/stores/usePublisherStore';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 5000
});

// có thể set interceptors ở đây nếu cần token
// api.interceptors.request.use(config => {
//   config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
//   return config
// })

api.interceptors.request.use(
  (config) => {
    const bookStore = useBookStore();
    const publisherStore = usePublisherStore();
    bookStore.loading = true;
    publisherStore.loading = true;
    return config;
  },
  (error) => {
    // Do something with request error
    const bookStore = useBookStore();
    const publisherStore = usePublisherStore();
    bookStore.loading = true;
    publisherStore.loading = true;
    return Promise.reject(error);
  }
)

api.interceptors.response.use(
  (response) => {
    const bookStore = useBookStore();
    const publisherStore = usePublisherStore();
    bookStore.loading = false;
    publisherStore.loading = false;
    return response;
  },
  (error) => {
    const bookStore = useBookStore();
    const publisherStore = usePublisherStore();
    bookStore.loading = false;
    publisherStore.loading = false;

    let errorMessage = error?.message
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    
    if (error.response?.status !== 410) {
      toast.error(errorMessage);
    }

    return Promise.reject(error);
  }
)

export default api;
