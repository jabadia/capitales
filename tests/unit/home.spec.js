import { shallowMount } from '@vue/test-utils';
import Home from '@/views/Home.vue';

describe('Home.vue methods', () => {
    const wrapper = shallowMount(Home);

    it('deburrs strings', () => {
        expect(wrapper.vm.deburr('París')).toEqual('Paris');
        expect(wrapper.vm.deburr('Paris')).toEqual('Paris');
        expect(wrapper.vm.deburr('áéíóú')).toEqual('aeiou');
        expect(wrapper.vm.deburr('ÁÉÍÓÚ')).toEqual('AEIOU');
    });

    it('check correct answers', () => {
        expect(wrapper.vm.isCorrectAnswer('París', 'paris')).toBe(true);
        expect(wrapper.vm.isCorrectAnswer('París', 'pariss')).toBe(false);
        expect(wrapper.vm.isCorrectAnswer('París', '')).toBe(false);
    });
    // it('renders props.msg when passed', () => {
    //     const msg = 'new message';
    //     const wrapper = shallowMount(Home, {
    //         propsData: { msg },
    //     });
    //     expect(wrapper.text()).toMatch(msg);
    // });
});
