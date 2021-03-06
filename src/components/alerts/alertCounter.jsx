/*
 * Copyright 2018 Expedia, Inc.
 *
 *       Licensed under the Apache License, Version 2.0 (the "License");
 *       you may not use this file except in compliance with the License.
 *       You may obtain a copy of the License at
 *
 *           http://www.apache.org/licenses/LICENSE-2.0
 *
 *       Unless required by applicable law or agreed to in writing, software
 *       distributed under the License is distributed on an "AS IS" BASIS,
 *       WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *       See the License for the specific language governing permissions and
 *       limitations under the License.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';

import './alerts.less';
import alertsStore from './stores/serviceAlertsStore';

const alertsRefreshInterval = (window.haystackUiConfig && window.haystackUiConfig.refreshInterval);

@observer
export default class AlertCounter extends React.Component {
    static propTypes = {
        serviceName: PropTypes.string.isRequired
    };

    componentDidMount() {
        alertsStore.fetchUnhealthyAlertCount(this.props.serviceName);
        this.timerID = setInterval(
            () => alertsStore.fetchUnhealthyAlertCount(this.props.serviceName),
            alertsRefreshInterval
        );
    }

    componentWillReceiveProps(nextProp) {
        alertsStore.fetchUnhealthyAlertCount(nextProp.serviceName);
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    render() {
        if (alertsStore.unhealthyAlertCount) {
            return (
                <span className="badge alert-counter">{alertsStore.unhealthyAlertCount}</span>
            );
        }
        return null;
    }
}
