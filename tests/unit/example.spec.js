import {
  shallowMount,
  createLocalVue,
} from '@vue/test-utils';
import Vuex from 'vuex';
import Dashboard from '@/components/Dashboard.vue';

const localVue = createLocalVue();
localVue.use(Vuex);
const store = new Vuex.Store({
  state: {
    currentUser: null,
    userProfile: {},
    posts: [{ content: 'message' }],
    hiddenPosts: [],
  },
});

describe('Dashboard.vue', () => {
  it('toogle show_modal_comments', () => {
    const wrapper = shallowMount(Dashboard, {
      localVue,
      store,
    });
    wrapper.setData({
      showCommentModal: false,
    });
    expect(wrapper.vm.showCommentModal).toBe(false);

    wrapper.find('[jest="show-comment-modal"]').trigger('click');

    expect(wrapper.vm.showCommentModal).toBe(true);
  });
});
