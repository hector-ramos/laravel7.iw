jQuery( window ).on( 'load', () => {
    let browserWindow = $( this ),
        html          = $( document.documentElement );
    
    // [Page Preloader] ::start
    (() => {
        $( '.with-page-preloader' ).addClass( 'page-preloaded' );
    })();
    // [Page Preloader] ::end
});

jQuery( document ).ready( ($) => {
    let browserWindow = $( this ),
        _window       = $( window ),
        currentDoc    = $( document ),
        html          = $( document.documentElement ),
        body          = $( document.body ),
        masthead      = $( '#masthead' ),
        footer        = $( '#footer' ),
        headNav       = $( '#head-navigation' ),
        mainContent   = $( '.main-content' ),
        smartForm     = html.find( '.smart-form' );

    // [Anchor] ::start
    (() => {
        let hash         = body.find( 'a[href="#"]' ),
        externalLink = body.find( 'a[rel=external]' );

        externalLink.attr( 'target', '_blank' );
        hash.attr( 'href', 'javascript:void(0);' );
    })();
    // [Anchor] ::end

    // [Form Validate] ::start
    (() => {

        let formSelector = 'form[data-with-form-validator="true"]';

        let submitButtonEnable = (parentEl) => {
            $( parentEl ).find( '[type="submit"]' )
                .removeAttr( 'readonly' )
                .removeClass( 'disabled' );
        };
        
        let submitButtonDisable = (parentEl) => {
            $( parentEl ).find( '[type="submit"]' )
                .attr( 'readonly', 'readonly' )
                .addClass( 'disabled' );
        };

        /**
         *
         * @param jQuery formsEl
         */
        let isFormValid = (formsEl) => {

            $( formsEl ).each( function(index) {
                if ( $( this ).valid() ) {
                    submitButtonEnable( this );
                } else {
                    submitButtonDisable( this );
                }
            });

        };

        // Validator defaults
        $.validator.setDefaults({
            showErrors: function(map, list) {
                $.each(list, function(index, error) {
                    $( error.element ).parents( '.element-wrapper' ).addClass( 'has-error' );
                    $( error.element ).attr( 'title', error.message );
                });
            }
        });

        // Trigger validate plugin
        $( formSelector ).validate( {
            onkeyup: function(element) {
                isFormValid( this.currentForm );
            },
            submitHandler: function (form) {

                let processingMessage = '';

                if (typeof $(form).data('processingMessage') !== 'undefined') {
                    processingMessage = $( form ).data( 'processing-message' );
                }

                // Disable form elements
                $( form ).find( 'input, button, textarea' ).attr( 'readonly', 'readonly' ).addClass( 'disabled' );

                // Show loading overlay
                $.LoadingOverlay('show', {
                    text: processingMessage,
                    textClass: 'position-absolute pt100 text-center c-2',
                    textResizeFactor: 0.2,
                });

                // Then submit the button
                form.submit();

            },
        } );
        
        // Set the submit buttons to readonly
        submitButtonDisable( formSelector );
        
        // Run form validation check on load
        isFormValid( formSelector );

    })();
    // [Form Validate] ::end

    // [LoadingOverlay Initialization] ::start
    (() => {
        // for mdi implemented site only
        let customElem = $( '<div>', {
            'class': 'mdi mdi-48px mdi-spin mdi-loading c-gray-100'
        });

        $.LoadingOverlaySetup({
            image: '',
            background: 'rgba(0, 0, 0, 0.5)',
            custom: customElem
            // fontawesome: 'fa fa-spinner fa-pulse',
            // fontawesomeColor: '#ffffff'
        });
    })();
    // [LoadingOverlay Initialization] ::end

    // [LightGallery] ::start
    (() => {
        $( '#lightgallery' ).lightGallery();
    })();
    // [LightGallery] ::end

    // [Date Time Picker] ::start
    (() => {
        let options = {format: 'L'};
        $( '.datetimepicker' ).datetimepicker(options);
    })();
    // [Date Time Picker] ::end

    // [Form Errors] ::start
    // Check if the form was submitted
    // Then scroll to the error messages
    (() => {
        if ( smartForm.hasClass( 'form-with-errors' ) ) {
            let firstElementWithError = smartForm.find( 'li[data-element-with-error]').eq( 0 ),
                firstElementWithErrorTarget = '#' + firstElementWithError.data( 'element-with-error' ),
                // panelForm = smartForm.find( '.panel' ),
                panelFormGroup = smartForm.find( '.form-group' );

            // Find the elements with errors and set focus on click
            smartForm.find( 'li[data-element-with-error]' ).on( 'click', (e) => {

                let _this    = $( e.currentTarget ),
                    _target  = '#' + _this.data( 'element-with-error' ),
                    _element = $( _target );

                // $( '[data-toggle="tooltip"]' ).tooltip({
                //     trigger: 'focus',
                // });

                _element.focus()
                    .select();

                // No need to scroll again
                if ( _target == firstElementWithErrorTarget ) {
                    return false;
                }

                $.scrollTo( _element, {
                    duration: 600,
                    offset: {
                        top: -220
                    },
                    onAfter: () => {
                        _element.trigger( 'click' );
                    }
                });
            });

            let scrollToError = () => {
                let isRecaptchElem = false;

                // fix scroll to on bootstrap-select pickers
                if ($( firstElementWithErrorTarget ).hasClass( 'selectpicker' )) {
                    firstElementWithErrorTarget = $( firstElementWithErrorTarget ).parent();
                } else if ($( firstElementWithErrorTarget ).hasClass( 'g-recaptcha-response' )) {
                    firstElementWithErrorTarget = $( firstElementWithErrorTarget ).closest( '.g-recaptcha' );
                    isRecaptchElem = true;
                }

                $.scrollTo( firstElementWithErrorTarget, {
                    duration: 1200,
                    offset: {
                        top: -220
                    },
                    onAfter: () => {
                        if (isRecaptchElem) {
                            firstElementWithErrorTarget.trigger( 'click' );
                        } else {
                            firstElementWithError.trigger( 'click' );
                        }
                    }
                });

            };

            setTimeout( scrollToError, 400 );

            // Check if 'form-group' has an error
            panelFormGroup.each( (e, el) => {
                let target = $( el );

                if ( target.hasClass('has-error') ) {
                    let panelSiblings = target.closest( '.panel' ).siblings( '.panel' );

                    target.closest( '.panel' ).addClass( 'panel--has-form-error' );

                    panelSiblings.find( '.panel-collapse' ).removeClass( 'in' );

                    panelSiblings.find( '.panel-title > a' ).attr( 'aria-expanded', 'false' );
                }
            });

            // Check if panel has an error
            let panelWithError = $( '.panel--has-form-error' );
                firstPanelWithError = panelWithError.first();

            // Show content of the first panel that has an error
            firstPanelWithError.find( '.panel-collapse' ).addClass( 'in' );

            // Rotate toggle button icon of the first panel that has an error
            firstPanelWithError.find( '.panel-title > a' ).attr( 'aria-expanded', 'true' );

        }

    })();
    // [Form Errors] ::start[


    // [Back to Top] ::start
    (() => {

        let backToTopBtn = mainContent.find( '#back-to-top' );

        _window.on( 'scroll', _.throttle( (e) => {

            let _this = $( e.currentTarget );

            if ( _this.scrollTop() > 500 ) {
                backToTopBtn.fadeIn();
            } else {
                backToTopBtn.fadeOut();
            }

        }, 300));

        backToTopBtn.on( 'click', (e) => {

            let el = $( e.currentTarget );

            $( 'html, body' ).animate({
                scrollTop: 0
            }, 700);

            e.preventDefault();

        });

    })();
    // [Back to Top] ::end

    // [Bootstrap Select v4] ::start
    (() => {
        $('.selectpicker').selectpicker({
            iconBase: 'fa',
            style: ''
        });
    })();
    // [Bootstrap Select v4] ::end

    // [Search] ::start
    (() => {
        let $searchForm = $( '.search-form' );

        $searchForm.on('submit', (e) => {
            let $search = $( 'input[name=search]' );

            if ($search.val() == null || $.trim( $search.val() ) == '') {
                e.preventDefault();
            }
        });
    })();
    // [Search] ::end

    // [reCAPTCHA v2 and Invisible reCAPTCHA] ::start
    (() => {
        let recaptchaForm = null;

        window.onSubmit = (token) => {
            let animateFormSubmit = recaptchaForm.find( '#recaptcha' ).data( 'submit-animation' );
            if (animateFormSubmit && animateFormSubmit == 1) {
                $.LoadingOverlay( 'show' );
            }
            recaptchaForm.submit();
        };

        let execute = ( e ) => {
            e.preventDefault();
            grecaptcha.execute();
        };

        let onLoadInvisible = () => {
            let element = $( 'button.btn-recaptcha' );

            element.on('click', execute);
            recaptchaForm = element.closest( 'form' );
        };

        if ($( '#recaptcha' ).length > 0) {
            onLoadInvisible();
        }
    })();
    // [reCAPTCHA v2 and Invisible reCAPTCHA] ::end

    // [Slick] ::start
    (() => {
        $( '.responsive' ).slick({
            dots: true,
            infinite: false,
            speed: 300,
            slidesToShow: 4,
            slidesToScroll: 4,
            responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
            ]
        });
    })();
    // [Slick] ::end


});
