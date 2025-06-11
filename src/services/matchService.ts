import api from './api';

export const matchService = {
  getMessages: (matchId: string) => api.get(`/matches/${matchId}/messages`),
  sendMessage: (matchId: string, content: string) =>
    api.post(`/matches/${matchId}/messages`, {content}),
  findMatch: () => api.post('/matches/find'),
  getCurrentMatch: () => api.get('/matches/current'),
  extendMatch: (matchId: string) => api.post(`/matches/${matchId}/extend`),
};

export default matchService;
