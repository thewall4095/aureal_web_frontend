import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  apiUrl: string = environment.apiUrl;
  constructor(private api: ApiService) { }

  isMobile(){
    return window.innerWidth <= 1024;
  }

  browseEpisodes(page, pageSize) {
    // if(localStorage.getItem('userId')){
    //   return this.api.get(this.apiUrl+'/public/browseEpisode?page='+page+'&pageSize='+pageSize);
    // }
    return this.api.get(this.apiUrl + '/public/browseEpisode?page=' + page + '&pageSize=' + pageSize);
  }

  browseHiveEpisodes(page, pageSize) {
    if (localStorage.getItem('userId')) {
      return this.api.get(this.apiUrl + '/public/browseHiveEpisodes?page=' + page + '&pageSize=' + pageSize + '&user_id=' + localStorage.getItem('userId'));
    } else {
      return this.api.get(this.apiUrl + '/public/browseHiveEpisodes?page=' + page + '&pageSize=' + pageSize);
    }
  }

  recommendedEpisodes(page, pageSize, category_ids) {
    if(category_ids){
      if (localStorage.getItem('userId')) {
        return this.api.get(this.apiUrl + '/public/exploreEpisodes?page=' + page + '&pageSize=' + pageSize + '&user_id=' + localStorage.getItem('userId') + '&category_ids=' + category_ids);
      } else {
        return this.api.get(this.apiUrl + '/public/exploreEpisodes?page=' + page + '&pageSize=' + pageSize + '&category_ids=' + category_ids);
      }
    }else{
      if (localStorage.getItem('userId')) {
        return this.api.get(this.apiUrl + '/public/exploreEpisodes?page=' + page + '&pageSize=' + pageSize + '&user_id=' + localStorage.getItem('userId'));
      } else {
        return this.api.get(this.apiUrl + '/public/exploreEpisodes?page=' + page + '&pageSize=' + pageSize);
      }
    }
  }

  getNewlyReleasedPodcasts(page, pageSize) {
    if (localStorage.getItem('userId')) {
      return this.api.get(this.apiUrl + '/public/newest?page=' + page + '&pageSize=' + pageSize + '&user_id=' + localStorage.getItem('userId'));
    } else {
      return this.api.get(this.apiUrl + '/public/newest?page=' + page + '&pageSize=' + pageSize);
    }
  }

  getRecentlyPlayedEpisodes(page, pageSize) {
    if (localStorage.getItem('userId')) {
      return this.api.get(this.apiUrl + '/public/recently?page=' + page + '&pageSize=' + pageSize + '&user_id=' + localStorage.getItem('userId'));
    } else {
      return this.api.get(this.apiUrl + '/public/recently?page=' + page + '&pageSize=' + pageSize);
    }
  }

  getPopularTrendingPodcasts(page, pageSize) {
    if (localStorage.getItem('userId')) {
      return this.api.get(this.apiUrl + '/public/intrend?page=' + page + '&pageSize=' + pageSize + '&user_id=' + localStorage.getItem('userId'));
    } else {
      return this.api.get(this.apiUrl + '/public/intrend?page=' + page + '&pageSize=' + pageSize);
    }
  }

  getRecommendedPodcasts(page, pageSize) {
    if (localStorage.getItem('userId')) {
      return this.api.get(this.apiUrl + '/public/recommend?page=' + page + '&pageSize=' + pageSize + '&user_id=' + localStorage.getItem('userId'));
    } else {
      return this.api.get(this.apiUrl + '/public/recommend?page=' + page + '&pageSize=' + pageSize);
    }
  }

  getExplorePodcasts(page, pageSize, category_ids) {
    if(category_ids){
      if (localStorage.getItem('userId')) {
        return this.api.get(this.apiUrl + '/public/explorePodcasts?page=' + page + '&pageSize=' + pageSize + '&user_id=' + localStorage.getItem('userId') + '&category_ids=' + category_ids);
      } else {
        return this.api.get(this.apiUrl + '/public/explorePodcasts?page=' + page + '&pageSize=' + pageSize + '&category_ids=' + category_ids);
      }
    }else{
      if (localStorage.getItem('userId')) {
        return this.api.get(this.apiUrl + '/public/explorePodcasts?page=' + page + '&pageSize=' + pageSize + '&user_id=' + localStorage.getItem('userId'));
      } else {
        return this.api.get(this.apiUrl + '/public/explorePodcasts?page=' + page + '&pageSize=' + pageSize);
      }
    }
  }

  getExploreNewPodcasts(page, pageSize, category_ids) {
    if(category_ids){
      if (localStorage.getItem('userId')) {
        return this.api.get(this.apiUrl + '/public/explorePodcasts?type=new&page=' + page + '&pageSize=' + pageSize + '&user_id=' + localStorage.getItem('userId') + '&category_ids=' + category_ids);
      } else {
        return this.api.get(this.apiUrl + '/public/explorePodcasts?type=new&page=' + page + '&pageSize=' + pageSize + '&category_ids=' + category_ids);
      }
    }else{
      if (localStorage.getItem('userId')) {
        return this.api.get(this.apiUrl + '/public/explorePodcasts?type=new&page=' + page + '&pageSize=' + pageSize + '&user_id=' + localStorage.getItem('userId'));
      } else {
        return this.api.get(this.apiUrl + '/public/explorePodcasts?type=new&page=' + page + '&pageSize=' + pageSize);
      }
    }
  }

  browsePodcasts(page, pageSize) {
    return this.api.get(this.apiUrl + '/public/browsePodcast?page=' + page + '&pageSize=' + pageSize);
  }

  getCategories() {
    return this.api.get(this.apiUrl + '/public/getCategory');
  }

  categoryBasedPodcasts(page, pageSize, categoryIds) {
    return this.api.get(this.apiUrl + '/public/categorySearch?page=' + page + '&pageSize=' + pageSize + '&category_ids=' + categoryIds);
  }

  categoryBasedEpisodes(page, pageSize, categoryIds) {
    return this.api.get(this.apiUrl + '/public/categorySearch?result_type=episode&page=' + page + '&pageSize=' + pageSize + '&category_ids=' + categoryIds);
  }

  upvoteEpisode(body) {
    return this.api.post(this.apiUrl + '/public/voteEpisode', body);
  }

  upvoteComment(body) {
    return this.api.post(this.apiUrl + '/public/voteComment', body);
  }

  viewEpisode(body) {
    return this.api.post(this.apiUrl + '/public/views', body);
  }

  getEpisode(episode_id) {
    return this.api.get(this.apiUrl + '/public/getEpisode?episode_id=' + episode_id);
  }

  getEpisodeShort(episode_id) {
    return this.api.get(this.apiUrl + '/public/getEpisode?short_data=true&episode_id=' + episode_id);
  }


  search(searchQuery, page, pageSize) {
    return this.api.get(this.apiUrl + '/public/search?page=' + page + '&pageSize=' + pageSize + '&word=' + searchQuery);
  }

  getComments(episode_id) {
    return this.api.get(this.apiUrl + '/public/getComments?episode_id=' + episode_id);
  }


  addComment(body) {
    return this.api.post(this.apiUrl + '/private/comment', body);
  }

  addReply(body) {
    return this.api.post(this.apiUrl + '/private/reply', body);
  }

  getBadge(episode_id) {
    return this.api.get(this.apiUrl + '/public/getBadge?episode_id=' + episode_id);
  }

  getAllCommunity() {
    return this.api.get(this.apiUrl + '/public/getCommunity');
  }

  getFollowedCommunity(user_id) {
    return this.api.get(this.apiUrl + '/public/getCommunity?user_id=' + user_id + '&relation=follower');
  }

  getCreatedCommunity(user_id) {
    return this.api.get(this.apiUrl + '/public/getCommunity?user_id=' + user_id + '&relation=creator');
  }

  getEpisodeCommunity(episode_id) {
    return this.api.get(this.apiUrl + '/public/getEpisodeCommunity?episode_id=' + episode_id);
  }

  searchCommunity(word) {
    return this.api.get(this.apiUrl + '/public/searchCommunity?word=' + word);
  }

  createCommunity(body) {
    return this.api.post(this.apiUrl + '/public/addCommunity', body);
  }

  assignCommunity(body) {
    return this.api.post(this.apiUrl + '/public/assignCommunityEpisode', body);
  }

  removeCommunity(body) {
    return this.api.post(this.apiUrl + '/public/removeCommunityEpisode', body);
  }

  subscribeCommunity(body) {
    return this.api.post(this.apiUrl + '/public/subscribeCommunity', body);
  }

  manualHivePublish(body) {
    return this.api.post(this.apiUrl + '/private/manualHivePublish', body);
  }

  addListen(body) {
    return this.api.post(this.apiUrl + '/public/views', body);
  }

  userAuth(body) {
    return this.api.post(this.apiUrl + '/public/userAuth', body);
  }

  followPodcast(body) {
    return this.api.post(this.apiUrl + '/public/follow', body);
  }

  getFeaturedPodcasts(userId, page, pageSize) {
    if(userId){
      return this.api.get(this.apiUrl + '/public/featured?user_id=' + userId + '&page=' + page + '&pageSize=' + pageSize );
    }else{
      return this.api.get(this.apiUrl + '/public/featured?page=' + page + '&pageSize=' + pageSize);
    }
  }

  getFollowedEpisodes(userId, page, pageSize) {
    if(userId){
      return this.api.get(this.apiUrl + '/public/newEpisodes?user_id=' + userId + '&page=' + page + '&pageSize=' + pageSize );
    }else{
      return this.api.get(this.apiUrl + '/public/newEpisodes?page=' + page + '&pageSize=' + pageSize);
    }
  }

  getPodcastEpisodes(userId, podcastId, page, pageSize) {
    if(userId){
      return this.api.get(this.apiUrl + '/public/episode?user_id=' + userId + '&podcast_id=' + podcastId + '&page=' + page + '&pageSize=' + pageSize );
    }else{
      return this.api.get(this.apiUrl + '/public/episode?podcast_id=' + podcastId + '&page=' + page + '&pageSize=' + pageSize);
    }
  }

  getOtherEpisodes(episode_id, podcast_id) {
    return this.api.get(this.apiUrl + '/public/getOtherEpisode?episode_id=' + episode_id + '&podcast_id=' + podcast_id);
  }

  getSimilarPodcasts(podcast_id) {
    return this.api.get(this.apiUrl + '/public/getSimilarPodcasts?podcast_id=' + podcast_id + '&user_id=' + localStorage.getItem('userId'));
  }
}
