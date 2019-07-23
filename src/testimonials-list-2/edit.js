const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const { RichText, InspectorControls, MediaUpload, PanelColorSettings } = wp.editor;
const { RangeControl, PanelBody, Button } = wp.components;
import { defaultItem, getStyles, typographyArr } from './block';
import { InspectorContainer, ContainerEdit } from '../commonComponents/container/container';
import { TypographyContainer, getTypography } from '../commonComponents/typography/typography';
import { Plus } from '../commonComponents/icons/plus';

/**
 * Keys for new blocks
 * @type {number}
 */
let key = 0;

/**
 * The edit function describes the structure of your block in the context of the editor.
 * This represents what the editor will render when the block is used.
 *
 * The "edit" property must be a valid function.
 * @param {Object} props - attributes
 * @returns {Node} rendered component
 */
export default class Edit extends Component {
    state = {
        activeSubBlock: -1,
    };

    /**
     * Add a new item to list with default fields
     */
    addItem = () => {
        key++;
        this.props.setAttributes( {
            items: [ ...this.props.attributes.items, {
                ...defaultItem,
                title: defaultItem.title + ' ' + ( key ),
                key: 'new ' + new Date().getTime(),
            } ],
        } );
        setTimeout( () => {
            const element = document.querySelector( '.kenzap-testimonials-2 .owl-carousel' );
            element.scrollLeft = element.scrollWidth;
        } );
    };

    /**
     * Change any property of item
     * @param {string} property - editable field
     * @param {string} value - for field
     * @param {number} index - of items array
     * @param {boolean} withMutation - in some cases we should avoid mutation for force rerender component
     */
    onChangePropertyItem = ( property, value, index, withMutation = false ) => {
        const items = withMutation ? [ ...this.props.attributes.items ] : this.props.attributes.items;
        if ( ! items[ index ] || typeof items[ index ][ property ] !== 'string' ) {
            return;
        }
        items[ index ][ property ] = value;
        this.props.setAttributes( { items: items } );
    };

    /**
     * Remove item
     * It also add default item if we remove all elements from array
     * @param {number} index - of item
     */
    removeItem = ( index ) => {
        const items = [ ...this.props.attributes.items ];
        if ( items.length === 1 ) {
            this.props.setAttributes( { items: [ defaultItem ] } );
        } else {
            items.splice( index, 1 );
            this.props.setAttributes( { items: items } );
        }
    };

    render() {
        const {
            className,
            attributes,
            setAttributes,
            isSelected,
        } = this.props;

        const { vars, kenzapContanerStyles } = getStyles( attributes );
        return (
            <div>
                <InspectorControls>
                    <PanelBody
                        title={ __( 'General', 'kenzap-testimonials' ) }
                        initialOpen={ false }
                    >
                        <p style={ { marginBottom: '5px' } }>{ __( 'Quote icon', 'kenzap-testimonials' ) }</p>
                        <MediaUpload
                            onSelect={ ( media ) => {
                                this.props.setAttributes( {
                                    icon: {
                                        iconMediaUrl: media.url,
                                        iconMediaId: media.id,
                                    },
                                } );
                            } }
                            value={ attributes.icon.iconMediaId }
                            allowedTypes={ [ 'image' ] }
                            render={ ( mediaUploadProps ) => (
                                <Fragment>
                                    { attributes.icon.iconMediaId ? (
                                        <Fragment>
                                            <Button
                                                isDefault
                                                onClick={ () => {
                                                    setAttributes( {
                                                        icon: {
                                                            iconMediaId: '',
                                                            iconMediaUrl: 'none',
                                                        },
                                                    } );
                                                } }
                                            >
                                                { __( 'Remove', 'kenzap-testimonials' ) }
                                            </Button>
                                            <div
                                                style={ {
                                                    width: '27px',
                                                    height: '27px',
                                                    display: 'inline-block',
                                                    margin: '0 0 0 5px',
                                                    backgroundImage: `url(${ attributes.icon.iconMediaUrl ? attributes.icon.iconMediaUrl : '' })`,
                                                    backgroundRepeat: 'no-repeat',
                                                    backgroundSize: 'cover',
                                                } }
                                            />
                                        </Fragment>
                                    ) : (
                                        <Button isDefault onClick={ mediaUploadProps.open }>
                                            { __( 'Upload/Choose', 'kenzap-testimonials' ) }
                                        </Button>
                                    ) }
                                </Fragment>

                            ) }
                        />
                        <p style={ { fontStyle: 'italic' } }>
                            { __( 'Override quote image for each testimonial.', 'kenzap-testimonials' ) }
                        </p>

                        {/* <PanelColorSettings
                            title={ __( 'Colors', 'kenzap-testimonials' ) }
                            initialOpen={ false }
                            colorSettings={ [
                                {
                                    value: attributes.textColor,
                                    onChange: ( value ) => {
                                        return setAttributes( { textColor: value } );
                                    },
                                    label: __( 'Text color', 'kenzap-testimonials' ),
                                },
                            ] }
                        /> */}
                    </PanelBody>

                    <TypographyContainer
                        setAttributes={ setAttributes }
                        typographyArr={ typographyArr }
                        { ...attributes }
                    />

                    <InspectorContainer
                        setAttributes={ setAttributes }
                        { ...attributes }
                        withPadding
                        withWidth100
                        withBackground
                        withAutoPadding
                    />
                </InspectorControls>
                <div className={ className ? className : '' } style={ vars }>
                    <ContainerEdit
                        className={ `kenzap-testimonials-2 block-${ attributes.blockUniqId } ${ isSelected ? 'selected' : '' } ` }
                        attributes={ attributes }
                        withBackground
                        withPadding
                    >
                        <div className="kenzap-container" style={ kenzapContanerStyles }>
                            <div className="owl-carousel">
                                { attributes.items && attributes.items.map( ( item, index ) => (
                                    <div
                                        key={ item.key }
                                        className="testimonial-box"
                                    >
                                        <button className="remove" onClick={ () => this.removeItem( index ) }>
                                            <i className="dashicons dashicons-no" />
                                        </button>
                                        <div className="testimonial-content">
                                            <div
                                                style={ { backgroundImage: `url(${ attributes.icon.iconMediaUrl })` } }
                                                className="testimonial-icon"
                                            />
                                            <RichText
                                                tagName="p"
                                                placeholder={ __( 'Testimonial', 'kenzap-testimonials' ) }
                                                value={ item.testimonial }
                                                onChange={ ( value ) => this.onChangePropertyItem( 'testimonial', value, index, true ) }
                                                style={ getTypography( attributes, 0 ) }
                                            />
                                            <RichText
                                                tagName="span"
                                                placeholder={ __( 'Author', 'kenzap-testimonials' ) }
                                                value={ item.author }
                                                onChange={ ( value ) => this.onChangePropertyItem( 'author', value, index, true ) }
                                                style={ getTypography( attributes, 1 ) }
                                            />
                                        </div>
                                    </div>
                                ) ) }
                            </div>
                        </div>
                        <div className="editPadding" />
                        <button
                            className="addWhite"
                            onClick={ this.addItem }>
                            <span><Plus /></span>{ __( 'Add new testimonial', 'kenzap-testimonials' ) }
                        </button>
                    </ContainerEdit>
                </div>
            </div>
        );
    }
}
