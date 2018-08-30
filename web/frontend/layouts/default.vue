<template>
    <div id="app">
        <navigation/>
        <nuxt class="main"/>
        <stats-bar/>
        <footer-section/>
    </div>
</template>

<script>
import FooterSection from '~/layouts/sections/Footer'
import Navigation from '~/layouts/sections/Navigation'
import StatsBar from '~/layouts/sections/StatsBar'
import socket from '../socket'
import { mapActions } from 'vuex'

export default {
    components: {
        Navigation,
        FooterSection,
        StatsBar
    },
    mounted() {
        socket.on('notifyNode', data => {
            if(this.$store.state.node.keyedById[data.node_id]) {
                this.$store.state.node.keyedById[data.node_id] = data
            } else {
                this.$store.commit('node/addItem', data)
            }
        })
        socket.on('notifyNodeData', data => {
            if(this.$store.state.node.keyedById[data.node_id].hasOwnProperty('data')) {
                this.$store.state.node.keyedById[data.node_id].data = data.data
            }
        })
        socket.on('notifyPool', data => {
            if(this.$store.state.pool.keyedById[data.pool_id]) {
                this.$store.state.pool.keyedById[data.pool_id] = data
            } else {
                this.$store.commit('pool/addItem', data)
            }
        })
        socket.on('notifyPoolNetwork', data => {
            if(this.$store.state.pool.keyedById[data.pool_id].hasOwnProperty('data')) {
                this.$store.state.pool.keyedById[data.pool_id].data.network = data.poolNetwork
            }
        })
        socket.on('notifyPoolConfig', data => {
            if(this.$store.state.pool.keyedById[data.pool_id].hasOwnProperty('data')) {
                this.$store.state.pool.keyedById[data.pool_id].data.config = data.poolConfig
            }
        })
        socket.on('notifyPoolPool', data => {
            if(this.$store.state.pool.keyedById[data.pool_id].hasOwnProperty('data')) {
                this.$store.state.pool.keyedById[data.pool_id].data.pool = data.poolPool
            }
        })
    }
}
</script>