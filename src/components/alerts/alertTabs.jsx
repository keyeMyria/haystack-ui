/*
 * Copyright 2017 Expedia, Inc.
 *
 *         Licensed under the Apache License, Version 2.0 (the "License");
 *         you may not use this file except in compliance with the License.
 *         You may obtain a copy of the License at
 *
 *             http://www.apache.org/licenses/LICENSE-2.0
 *
 *         Unless required by applicable law or agreed to in writing, software
 *         distributed under the License is distributed on an "AS IS" BASIS,
 *         WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *         See the License for the specific language governing permissions and
 *         limitations under the License.
 */

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import AlertsTable from './alertsTable';
import {toQuery} from '../../utils/queryParser';

export default class AlertTabs extends React.Component {
    static propTypes = {
        location: PropTypes.object.isRequired,
        serviceName: PropTypes.string.isRequired,
        alertsStore: PropTypes.object.isRequired
    };

    static tabViewer(tabSelected, groupedAlerts, serviceName, location) {
        switch (tabSelected) {
            case 2:
                return <AlertsTable alerts={groupedAlerts.durationTP99} alertType="durationTP99" location={location} serviceName={serviceName}/>;
            default:
                return <AlertsTable alerts={groupedAlerts.failureCount} alertType="failureCount" location={location} serviceName={serviceName}/>;
        }
    }

    constructor(props) {
        super(props);
        const query = toQuery(this.props.location.search);
        const tabSelected = (query.type === 'durationTP99') ? 2 : 1;

        this.state = {
            tabSelected
        };

        this.toggleTab = this.toggleTab.bind(this);
    }

    toggleTab(tabIndex) {
        this.setState({tabSelected: tabIndex});
    }

    render() {
        const {
            serviceName,
            location
        } = this.props;

        const groupedAlerts = _.groupBy(this.props.alertsStore.alerts, _.property('type'));
        const unhealthyFailureCountAlerts = groupedAlerts.failureCount.filter(alert => alert.isUnhealthy).length;
        const unhealthyDurationTP99Alerts = groupedAlerts.durationTP99.filter(alert => alert.isUnhealthy).length;

        return (
            <section>
                <div className="alert-tabs pull-left">
                    <ul className="nav nav-tabs">
                        <li className={this.state.tabSelected === 1 ? 'active' : ''}>
                            <a className="alert-tabs_tab h4" role="button" tabIndex="-1" onClick={() => this.toggleTab(1)} >
                                <span>Failure Count </span>
                                <span className="badge">{unhealthyFailureCountAlerts}</span>
                            </a>
                        </li>
                        <li className={this.state.tabSelected === 2 ? 'active' : ''}>
                            <a className="alert-tabs_tab h4" role="button" tabIndex="-1" onClick={() => this.toggleTab(2)} >
                                <span>Duration TP99 </span>
                                <span className="badge">{unhealthyDurationTP99Alerts}</span>
                            </a>
                        </li>
                    </ul>
                </div>
                <section>{AlertTabs.tabViewer(this.state.tabSelected, groupedAlerts, serviceName, location)}</section>
            </section>
        );
    }
}
