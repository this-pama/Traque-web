import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const colourOptions = {
    ocean: { label: 'Ocean', color: '#00B8D9', isFixed: true },
    blue: { label: 'Blue', color: '#0a6eb4', disabled: true },
    purple: { label: 'Purple', color: '#5243AA' },
    red: { label: 'Red', color: '#FF5630', isFixed: true },
    orange: { label: 'Orange', color: '#FF8B00' },
    yellow: { label: 'Yellow', color: '#F7B825' },
    green: { label: 'Green', color: '#3f7e44' },
    forest: { label: 'Forest', color: '#00875A' },
    slate: { label: 'Slate', color: '#253858' },
    silver: { label: 'Silver', color: '#666666' },
    gray: { label: 'Gray', color: '#8C9BA5' },
    lightGray: { label: 'Light Gray', color: 'rgba(224, 230, 234, 0.53)' },
}

//TODO:
//-- Prop types
//-- Box shadow
const WarningIcon = styled.span`
    position: absolute;
    display: inline-block;
    width: 24px;
    height: 22px;
    background: #edb124;
    color: white;
    top: 10px;
    right: 14px;
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
    :after {
        display: inline-block;
        content: '!';
        color: white;
        font-size: 17px;
        text-align: center;
        width: 24px;
        height: 22px;
        line-height: 27px;
        font-weight: 600;
    }
`
const StyledTile = styled.div`
    position: relative;
    min-height: 120px;
    border: ${(props) =>
        props.warning && !props.active
            ? `1px solid ${colourOptions.yellow.color}`
            : '1px solid transparent'};
    background-color: ${(props) =>
        props.active ? colourOptions.blue.color : 'white'};
    width: 210px;
    padding: 1rem 1rem 37px;
    margin: 0 0 0.5rem 0;
    color: ${(props) => (props.active ? 'white' : 'black')};
    cursor: pointer;
    .tile {
        &--header {
            font-size: 0.9rem;
            font-weight: 400;
            margin: 0 0 0.25rem;
        }
        &--label {
            position: absolute;
            left: 16px;
            bottom: 15px;
            line-height: 16px;
            font-size: 12px;
            color: ${(props) => (props.active ? 'inherit' : props.color)};
            border-radius: 25px;
            padding: 0 8px;
            font-weight: 600;
            border: 2px solid
                ${(props) => (props.active ? 'white' : props.color + '30')};

            text-transform: capitalize;
        }
    }
    .content {
        position: absolute;
        bottom: 40px;
        left: 16px;
        display: flex;
        align-items: baseline;
        justify-content: left;
        margin: 0 0 0.5rem 0;
        &--number {
            font-size: 1.5rem;
            font-weight: bold;
            margin: 0 0.5rem 0 0;
        }
        &--label {
            text-transform: uppercase;
            color: ${(props) =>
                props.active ? 'inherit' : 'rgba(21, 41, 53, 0.7)'};
        }
    }
    box-shadow: 0px 0px 10px #343c4845;
    &:hover {
        border: 1px solid ${colourOptions.blue.color};
    }
`

const Tile = ({
    header,
    amount,
    role,
    color,
    amountLabel,
    active,
    warning,
    onClick,
}) => {
    return (
        <StyledTile
            active={active}
            warning={warning}
            onClick={onClick}
            color={color}
        >
            <h3 className="tile--header">{header}</h3>
            <div className="tile--content content">
                <span className="content--number">{amount}</span>
                <span className="content--label">{amountLabel}</span>
            </div>
            <span className="tile--label">{role}</span>
            {warning && <WarningIcon />}
        </StyledTile>
    )
}

// Tile.propTypes = {
//     title:
// }

Tile.defaultProps = {
    amount: '00',
    amountLabel: 'applicants',
    label: 'screener',
    active: false,
    warning: false,
    onClick: () => console.log('clicked callback tile'),
}

export default Tile
