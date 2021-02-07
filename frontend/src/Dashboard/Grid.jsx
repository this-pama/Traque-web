import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import styled, { createGlobalStyle } from 'styled-components'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-enterprise'
import { Button, Link, Icon } from '@wfp/ui'
import {iconOverflowMenu, iconChevronDown} from '@wfp/icons'
import moment from 'moment'
// import * as gridComponents from '../AgCells'

import ExcelIcon from './excelIcon.svg'

import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { toast } from 'react-toastify'

// TODO move defaultColDef and frameworkComponents to another file ?
const defaultColDef = {
    key: 0,
    sortable: true,
    resizable: true,
    filter: true,
    floatingFilter: true,
    headerHeight: 150,
    suppressMenu: true,
    filterParams: {
        newRowsAction: 'keep',
    },
    enableBrowserTooltips: true,
}

class Grid extends React.Component {
    _isMounted = false
    state = {
        api: null,
        params: null,
    }
    onGridReady = (params) => {
        const { sortModel, data, onResize, } = this.props

        if (this._isMounted) {
            const api = params.api

            this.setState({ api, params }, () => this.onResize())
        }
    }
    onResize = () => {
        const { api } = this.state
        api && api.sizeColumnsToFit()
    }
    componentDidMount() {
        this._isMounted = true
        window.addEventListener('resize', this.onResize)
    }

    componentWillUnmount() {
        // this.saveGridState();
        this._isMounted = false
        window.removeEventListener('resize', this.onResize)
    }

    onExport = (e) => {
        const { config } = this.props
        const { api } = this.state
        const fileName =
            this.props.exportFileName +
            ' ' +
            moment().format('YYYY-MM-DD HH-mm-ss')

        const params = {
            // 'allColumns: true' enables exporting hidden columns
            allColumns: true,
            fileName: fileName,
            columnKeys: config.exportedColumns,
            sheetName: this.props.exportFileName
        }
        api && api.exportDataAsExcel(params)
    }

    render() {
        const { data, config, floatingFilter, statusPanels } = this.props
        const portalElement = document.getElementById('export-button-portal')

        return (
            <>
                {portalElement &&
                    ReactDOM.createPortal(
                        <ExportButtonContent>
                            <Button
                                onClick={this.onExport}
                                kind="secondary"
                                small
                            >
                                <div className="export-btn">
                                    <div className="export-btn__text">
                                        Export{' '}
                                    </div>
                                    <img
                                        className="export-btn__img"
                                        src={ExcelIcon}
                                        alt="Spreadsheet icon"
                                    />
                                </div>
                            </Button>
                        </ExportButtonContent>,
                        portalElement
                    )}
                
                <div
                    id="custom-ag-grid"
                    className="ag-theme-balham"
                    style={{
                        width: '100%',
                        height: `${
                            Math.max(Math.min(8, data.length) * 80, 180) + 142
                        }px`,
                        marginTop: 20,
                    }}
                >
                    <StyleRewrite />
                    <AgGridReact
                        rowData={data}
                        defaultColDef={defaultColDef}
                        columnDefs={config.columnDefs}
                        // frameworkComponents={gridComponents}
                        reactNext={true}
                        suppressScrollOnNewData={true}
                        sideBar={ this.props.sideBar && 'columns'}
                        gridOptions={{
                            rowHeight: 80,
                            headerHeight: 80,
                            getContextMenuItems: (params) => {
                                var result = [
                                    'copy',
                                    'copyWithHeaders',
                                    'paste',
                                    'separator',
                                    'export',
                                    'separator',
                                ]
                                return result
                            },
                            statusBar: {
                                statusPanels: statusPanels != null ? statusPanels : [
                                    {
                                        statusPanel:
                                            'agTotalAndFilteredRowCountComponent',
                                        align: 'left',
                                    },
                                    {
                                        statusPanel: 'agTotalRowCountComponent',
                                        align: 'center',
                                    },
                                    {
                                        statusPanel:
                                            'agFilteredRowCountComponent',
                                    },
                                    {
                                        statusPanel:
                                            'agSelectedRowCountComponent',
                                    },
                                    { statusPanel: 'agAggregationComponent' },
                                ],
                            },
                            groupMultiAutoColumn: true,
                        }}
                        onGridReady={this.onGridReady}
                        floatingFilter={floatingFilter != null ? floatingFilter : true }
                        excelStyles={[
                            {
                                id: 'header',
                                rowHeight: '40px',
                                font: { 
                                    size: 15, bold: true, uppercase: true, color: '#ffffff' 
                                },
                                borders: {
                                    borderBottom: {
                                        lineStyle: 'Continuous', weight: 2
                                    },
                                },
                                interior: {
                                    color: "#0a6eb4", pattern: 'Solid'
                                },
                                alignment: {
                                    horizontal: 'Left', vertical: 'Center'
                                },
                            },
                            {
                                id: 'bold',
                                font: {
                                    size: 14, bold: true, color: '#000000'
                                },
                            },
                            {
                                id: 'darkGreyBackground',
                                interior: {
                                    color: '#727272',
                                    italic: true,
                                    pattern: 'Solid',
                                },
                                font: {
                                    color: '#ffffff',
                                },
                            },
                            {
                                id: 'darkRedBackground',
                                interior: {
                                    color: '#c5192d',
                                    italic: true,
                                    pattern: 'Solid',
                                },
                                font: {
                                    color: '#ffffff',
                                },
                            },
                            {
                                id: 'orangeBackground',
                                interior: {
                                    color: '#ebab34',
                                    pattern: 'Solid',
                                },
                                font: {
                                    color: '#000000',
                                },
                            },
                            {
                                id: 'greenBackground',
                                interior: {
                                    color: '#008000',
                                    pattern: 'Solid',
                                },
                                font: {
                                    color: '#ffffff',
                                },
                            },
                        ]}
                    />
                </div>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userRole: state.user.role.role_name,
    }
}

export default withRouter(connect(mapStateToProps)(Grid))

//TODO check if theres no better option for rendering the export button instead of Portal
const ExportButtonContent = styled.div`
    .export-btn {
        display: inline-flex;
        align-items: center;
    }
    .export-btn__img {
        width: 16px;
        height: 16px;
        margin-left: 8px;
    }
    &:hover {
        .export-btn__img {
            filter: brightness(0) invert(1);
        }
    }
`

export const StyleRewrite = createGlobalStyle`
    #custom-ag-grid.ag-theme-balham .ag-root {
        border: 0;
    }
    #custom-ag-grid .ag-root-wrapper {
        box-shadow: 0px 0px 10px #343C481F;
        overflow: visible;
    }

    #custom-ag-grid.ag-theme-balham .ag-root .ag-header-cell-label .ag-header-cell-text {
        line-height: 1.5;
        white-space: normal;
        color: #404040;
        font-weight: bold;
        display: inline;
        align-self: center;
    }

    #custom-ag-grid.ag-theme-balham .ag-header-row:first-child .ag-header-cell{
        background: #ffffffed;
    }
    #custom-ag-grid.ag-theme-balham .ag-header-cell:not(.ag-header-group-cell-no-group){
        background: white;
    }
    #custom-ag-grid.ag-theme-balham .ag-header{
        background: #ffffffed;
    }

    #custom-ag-grid.ag-theme-balham .ag-header-cell::after,
    #custom-ag-grid.ag-theme-balham .ag-header-group-cell::after {
        height: 60%;
        margin: 0;
        transform: translateY(-50%);
        top: 50%;
    }
    #custom-ag-grid.ag-theme-balham .ag-root .ag-cell {
        padding: 10px;
        line-height: initial;
        white-space: normal;
    }

    /* #custom-ag-grid.ag-theme-balham .ag-cell-inline-editing {
        height: 100%;
        padding: 0;
    } */

    #custom-ag-grid.ag-theme-balham  .ag-root .ag-header-cell-menu-button,
    #custom-ag-grid.ag-theme-balham .ag-root .ag-header-cell-menu-button .ag-icon-menu,
    #custom-ag-grid.ag-theme-balham .ag-root .ag-icon {
        height: 100%;
    }

    #custom-ag-grid.ag-theme-balham .ag-status-bar  {
        background: #fff;
        border: 1px solid #BDC3C7;
    }

    #swaggin {
        color: red;
    }

`
