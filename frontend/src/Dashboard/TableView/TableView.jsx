import React, { useEffect } from 'react'
import { Loading } from '@wfp/ui'
import useFilterTiles from '../hooks/useFilterTiles'
import Grid from '../../Dashboard/Grid'
import Header from '../Header'

const Applicants = ({
    data,
    filters,
    fetchData,
    title,
    gridConfig,
    middle,
    hideEmptyTiles,
    sortModel,
    exportFileName,
}) => {
    useEffect(() => {
        const getData = async () => fetchData()
        getData()
    }, [])
    const [filteredApplications, filterTiles] = useFilterTiles({
        data: data ? data.applications : null,
        filters: filters,
        hideEmptyTiles,
    })
    if (!filteredApplications || !filterTiles)
        return <Loading active withOverlay={true} />

    return (
        <>
            <Header
                count={data.applications.length || 0}
                title={title}
            ></Header>
            {filterTiles}
            {middle || null}

            <Grid
                data={filteredApplications}
                config={gridConfig}
                exportFileName={exportFileName}
                sortModel={sortModel}
            />
        </>
    )
}

export default Applicants
