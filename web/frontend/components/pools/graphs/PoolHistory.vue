<template>
    <section>
        <div class="columns">
            <b-select
                expanded
                v-model="selectedAttribute"
                class="column is-2 is-offset-5"
            >
                <option disabled value="0">Please an attribute</option>
                <option
                    v-for="(attribute, index) in compareAttributes"
                    :value="attribute.id"
                    :key="index"
                >
                    {{ attribute.label }}
                </option>
            </b-select>
            <b-select
                expanded
                v-model="selectedCompareAttribute"
                class="column is-2"
            >
                <option value="0">{{ compareOptionText }}</option>
                <option
                    v-for="(attribute, index) in compareAgainstAttributes"
                    :value="attribute.id"
                    :key="index"
                >
                    {{ attribute.label }}
                </option>
            </b-select>
            <v-date-picker
                mode='range'
                v-model='selectedDates'
                class="column is-3"
                id="datepicker"
            >
                <b-field
                    :type='inputState.type'
                    slot-scope='props'
                >
                    <b-input
                        type='text'
                        icon='calendar'
                        :value='props.inputValue'
                        :placeholder='inputState.message'
                        @change.native='props.updateValue($event.target.value)'
                        expanded
                    />
                    <p class='control' v-if='selectedDates'>
                        <a
                            :class='["button", inputState.type]'
                            @click='selectedDates = null'
                        >
                            Clear
                        </a>
                    </p>
                </b-field>
            </v-date-picker>
        </div>
        <div class="columns">
            <vue-highcharts
                class="column"
                :highcharts="highstock"
                :options="options"
                ref="historical"
            />
        </div>
    </section>
</template>

<script>
import vueMixin from '~/mixins/vueMixin.js'
import Highstock from "highcharts/highstock"
import DragPanes from 'highcharts/modules/drag-panes.js'
import Exporting from 'highcharts/modules/exporting.js'
import ExportData from 'highcharts/modules/export-data.js'
import { mapGetters } from 'vuex'

export default {
    name: 'Historical',
    props: {
        pools: {
            type: Array,
            required: true,
            default: () => []
        },
        selectedPools: {
            type: Array,
            required: true,
            default: () => []
        },
        selectedPoolData: {
            type: Array,
            required: true,
            default: () => []
        }
    },
    mixins: [vueMixin],
    data () {
        return {
            highstock: Highstock,
            selectedDates: {
                start: '',
                end: ''
            },
            selectedAttribute: 1,
            selectedCompareAttribute: 0,
            chartParams: {
                query: {
                    pool_id: {
                        $in: []
                    },
                    time: {
                        $gte: '',
                        $lte: ''
                    },
                    attribute: 'difficulty'
                }
            },
            attributes: [
                {
                    id: 1,
                    label: 'Difficulty',
                    location: 'data.network.difficulty',
                    name: 'difficulty',
                    format: (val) => {
                        return val.toLocaleString()
                    }
                },
                {
                    id: 2,
                    label: 'Hashrate',
                    location: 'data.pool.hashrate',
                    name: 'hashrate',
                    format: (val) => {
                        return this.humanReadableHashrate(val)
                    }
                },
                {
                    id: 3,
                    label: 'Height',
                    location: 'data.network.height',
                    name: 'height',
                    format: (val) => {
                        return val.toLocaleString()
                    }
                },
                {
                    id: 4,
                    label: 'Miners',
                    location: 'data.pool.miners',
                    name: 'miners',
                    format: (val) => {
                        return val.toLocaleString()
                    }
                },
                {
                    id: 5,
                    label: 'Total Blocks',
                    location: 'data.pool.totalBlocks',
                    name: 'totalBlocks',
                    format: (val) => {
                        return val.toLocaleString()
                    }
                },
                {
                    id: 6,
                    label: 'Total Miners Paid',
                    location: 'data.pool.totalMinersPaid',
                    name: 'totalMinersPaid',
                    format: (val) => {
                        return val.toLocaleString()
                    }
                },
                {
                    id: 7,
                    label: 'Total Payments',
                    location: 'data.pool.totalPayments',
                    name: 'totalPayments',
                    format: (val) => {
                        return val.toLocaleString()
                    }
                },
                {
                    id: 8,
                    label: 'Time',
                    location: 'data.network.timestamp',
                    name: 'timestamp',
                    format: (val) => {
                        return (new Date(val * 1000)).toUTCString()
                    }
                }
            ],
            options : {
                chart: {
                    backgroundColor: '#3c3c3c',
                    plotBorderColor: '#606063',
                    style: {
                        fontFamily: 'Roboto,sans-serif'
                    }
                },
                colors: [
                    '#f5f1f2',
                    '#b1e033',
                    '#ce289f',
                    '#6ca890',
                    '#91fb27',
                    '#ab0bd1',
                    '#fd3453',
                    '#22b29a',
                    '#26bf2a',
                    '#1a53bc',
                    '#60b2b3',
                    '#1aa0d8',
                    '#158af7',
                    '#f6b90a',
                    '#54c088',
                    '#2dd2d0',
                    '#ba7afa',
                    '#3afa02',
                    '#45afd0',
                    '#b8fe38',
                    '#8213f2'
                ],
                credits: {
                    enabled: false
                },
                labels: {
                    style: {
                        color: '#707073'
                    }
                },
                plotOptions: {
                    series: {
                        dataLabels: {
                            color: '#B0B0B3'
                        },
                        marker: {
                            lineColor: '#333'
                        }
                    }
                },
                rangeSelector: {
                    enabled: false,
                },
                scrollbar: {
                    barBackgroundColor: '#808083',
                    barBorderColor: '#808083',
                    buttonArrowColor: '#CCC',
                    buttonBackgroundColor: '#606063',
                    buttonBorderColor: '#606063',
                    rifleColor: '#FFF',
                    trackBackgroundColor: '#404043',
                    trackBorderColor: '#404043'
                },
                subtitle: {
                    text: '',
                    x: -20
                },
                title: {
                    style: {
                        color: '#E0E0E3',
                        textTransform: 'uppercase',
                        fontSize: '20px'
                    },
                    text: '',
                    x: -20
                },
                time: {
                    useUTC: true
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.85)',
                    split: true,
                    style: {
                        color: '#F0F0F0'
                    }
                },
                xAxis: {
                    gridLineColor: '#707073',
                    labels: {
                        style: {
                            color: '#E0E0E3'
                        }
                    },
                    lineColor: '#707073',
                    minorGridLineColor: '#505053',
                    tickColor: '#707073',
                    title: {
                        style: {
                            color: '#A0A0A3'

                        }
                    },
                    type: 'datetime'
                },
                yAxis: {
                    gridLineColor: '#707073',
                    height: '100%',
                    id: 'primary',
                    labels: {
                        style: {
                            color: '#E0E0E3'
                        }
                    },
                    lineColor: '#707073',
                    minorGridLineColor: '#505053',
                    offset: 30,
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }],
                    resize: {
                        enabled: true
                    },
                    title: {
                        style: {
                            color: '#A0A0A3'
                        },
                        text: 'Miners'
                    }
                }
            }
        }
    },
    mounted () {
        DragPanes(Highstock)
        Exporting(Highstock)
        ExportData(Highstock)
        const today = new Date()
        const startDate = this.convertToUTCStart(today)
        const endDate = this.convertToUTCEnd(today)
        this.selectedDates.start = new Date(startDate)
        this.selectedDates.end = new Date(endDate)

        this.chartParams.query.time.$gte = startDate
        this.chartParams.query.time.$lte = endDate
        this.chartParams.query.pool_id.$in = this.selectedPools
        this.chartParams.attribute = this.getAttributeName(this.selectedAttribute)
    },
    computed: {
        ...mapGetters('pool-history', { getChartData: 'list' }),
        inputState() {
            if (!this.selectedDates) {
                return {
                    type: 'is-danger',
                    message: 'Date required.',
                }
            }
            return {
                type: 'is-primary',
                message: '',
            }
        },
        compareAgainstAttributes () {
            return this.attributes.filter(val => val.id !== this.selectedAttribute)
        },
        compareAttributes () {
            return this.attributes.filter(val => val.id !== this.selectedCompareAttribute)
        },
        compareOptionText () {
            return this.selectedCompareAttribute === 0 ? 'Compare Against' : 'Remove Compare'
        }
    },
    methods: {
        addSecondaryYAxis () {
            this.clearSecondaryAxis()

            const newAxis = Object.assign({
                height: '40%',
                id: 'secondary',
                labels: {
                    style: {
                        color: '#E0E0E3'
                    }
                },
                lineColor: '#707073',
                minorGridLineColor: '#505053',
                offset: 30,
                opposite: true,
                title: {
                    style: {
                        color: '#A0A0A3'
                    },
                    text: this.getAttributeLabel(this.selectedCompareAttribute)
                },
                top: '60%'
            }, this.options.yAxis)
            this.$refs.historical.chart.addAxis(newAxis)
            this.resizePrimaryYAxis()
        },
        clearSecondaryAxis () {
            if(typeof this.$refs.historical.chart.get('secondary') !== 'undefined') {
                this.$refs.historical.chart.get('secondary').remove()
                this.resizePrimaryYAxis()
            }
        },
        resizePrimaryYAxis () {
            this.$refs.historical.chart.get('primary').update({
                height: parseInt(this.selectedCompareAttribute) === 0 ? '100%' : '60%',
                resize: {
                    enabled: typeof this.$refs.historical.chart.get('secondary') === 'undefined' ? false : true
                }
            })
        },
        addSeries (label, axisId) {
            this.$refs.historical.showLoading()
            this.$store.dispatch('pool-history/find', this.chartParams).then(() => {
                this.$refs.historical.chart.get(axisId).setTitle({text: label})
                this.getChartData.forEach((result, index) => {
                    const pool = this.pools.filter(pool => pool.id === result.pool_id)
                    this.$refs.historical.addSeries({
                        data: result.data.map(val => {
                            const catTime = new Date(val[0])
                            return [
                                catTime.getTime(),
                                val[1]
                            ]
                        }),
                        displayFormat: this.attributes.filter(attribute => attribute.label === label)[0].format,
                        id: pool[0].id,
                        label: label,
                        name: pool[0].name,
                        yAxis: axisId
                    })
                })

                this.$refs.historical.chart.hideLoading()
            })
        },
        addPoint(points, axisId) {
            const series = this.$refs.historical.chart.get(axisId)
            series.addPoint(points)
        },
        clearData () {
            this.$store.commit('pool-history/clearAll')
            this.$refs.historical.removeSeries()
        },
        getAttributeLabel (id) {
            return this.attributes.filter(val => val.id === id)[0].label
        },
        getAttributeLocation (id) {
            return this.attributes.filter(val => val.id === id)[0].location
        },
        getAttributeName (id) {
            return this.attributes.filter(val => val.id === id)[0].name
        }
    },
    watch: {
        selectedDates: {
            handler: function(newVal, oldVal) {
                if(newVal === null || (oldVal !== null && newVal.start === oldVal.start && newVal.end === oldVal.end)) return

                this.chartParams.query.time.$gte = this.convertToUTCStart(newVal.start)
                this.chartParams.query.time.$lte = this.convertToUTCEnd(newVal.end)

                this.clearData()
                this.addSeries(this.getAttributeLabel(this.selectedAttribute), 'primary')
                if(parseInt(this.selectedCompareAttribute) !== 0) {
                    this.addSecondaryYAxis()
                    this.addSeries(this.getAttributeLabel(this.selectedCompareAttribute), 'secondary')
                }
            },
            deep: true
        },
        selectedAttribute: function(newVal, oldVal) {
            if(newVal === oldVal) return

            this.selectedCompareAttribute = 0
            this.chartParams.query.attribute = this.getAttributeName(newVal)
            this.clearData()
            this.clearSecondaryAxis()
            this.addSeries(this.getAttributeLabel(this.selectedAttribute), 'primary')
        },
        selectedCompareAttribute: function(newVal, oldVal) {
            if(newVal === oldVal) return

            //remove compare
            if(parseInt(newVal) === 0) {
                this.chartParams.query.attribute = this.getAttributeName(this.selectedAttribute)
                this.clearData()
                this.clearSecondaryAxis()
                return this.addSeries(this.getAttributeLabel(this.selectedAttribute), 'primary')
            }

            this.chartParams.query.attribute = this.getAttributeName(newVal)
            this.addSecondaryYAxis()
            this.addSeries(this.getAttributeLabel(this.selectedCompareAttribute), 'secondary')
        },
        selectedPools: {
            handler: function(newVal, oldVal) {
                if(newVal === oldVal) return

                this.chartParams.query.pool_id.$in = newVal
                this.clearData()
                this.addSeries(this.getAttributeLabel(this.selectedAttribute), 'primary')
            },
            deep: true
        },
        selectedPoolData: {
            handler: function(newVal) {
                // if(!this.live) return

                const selectedPoolData = newVal.filter(pool => this.selectedPools.includes(pool.id))

                selectedPoolData.forEach(poolData => {
                    if(!poolData.data) return

                    const series = this.$refs.historical.chart.get(poolData.id)
                    if (series === undefined) return
                    // console.log(series.options)
                    const yAxis = series.yAxis.options.id
                    // console.log(poolData.data)
                })

                // console.log(this.$refs.historical.chart.get(newVal.id))
                // const x = this.getAttributeLocation(this.selectedAttribute).split('.').reduce((acc, part) => acc && acc[part], selectedPoolData)
                // console.log(x)
            },
            deep: true
        }
    }
}
</script>