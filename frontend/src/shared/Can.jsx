import { check } from './utils'

const Can = (props) =>
    check(props.rules, props.userRole, props.perform, props.data)
        ? props.yes()
        : props.no()

Can.defaultProps = {
    yes: () => null,
    no: () => null,
}

export default Can
