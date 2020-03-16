jQuery( document ).ready( ($) => {

    let html = $( document.documentElement );

    // Replace blade directives for echo in the highlight js section
    $( '.sample-markup' ).each( (index, el) => {

        let markup = el.innerHTML;

        let updateMarkupVersion1 = _.replace(markup, new RegExp('{~~', 'g'), '{!!');
        updateMarkupVersion1 = _.replace(updateMarkupVersion1, new RegExp('~~}', 'g'), '!!}');

        updateMarkupVersion2 = _.replace(updateMarkupVersion1, new RegExp('{~', 'g'), '{{');
        updateMarkupVersion2 = _.replace(updateMarkupVersion2, new RegExp('~}', 'g'), '}}');

        el.innerHTML = updateMarkupVersion2;
    });

    // [Highlight.js] ::start
    hljs.initHighlightingOnLoad();

    $( 'pre code' ).each(( i, block ) => {
        hljs.highlightBlock( block );
    });
    // [Highlight.js] ::end

    // [ClipboardJS] ::start
    // instantiate tooltip
    $( 'body' ).tooltip({
        selector: '.btn-clipboard',
        title: 'Copy to clipboard',
        placement: 'right'
    });

    // iterate to elements with class .sample-markup
    $( '.sample-markup' ).each((index, element) => {
        let      _this = $( element ),
            codeString = _this.text().trim();

        _this.parent().prepend( `<button type="button" class="btn btn-sm btn-clipboard"><i class="mdi mdi-18 mdi-clipboard-text-outline"></i></button>` );
        _this.attr( 'data-clipboard-text', codeString );
    });

    // instantiate clipboard
    let clipboard = new ClipboardJS('.btn-clipboard', {
        text: (trigger) => {
            return $( trigger ).next( '.sample-markup' ).data( 'clipboard-text' );
        }
    });

    // handle clipboard on success
    clipboard.on('success', (e) => {
        // reset the tooltip title
        $( e.trigger )
            .attr( 'data-original-title', 'Copied!' )
            .tooltip( 'show' )
            .attr( 'data-original-title', 'Copy to clipboard' );

        // reset the selection
        e.clearSelection();

        // hide tooltip after timeout
        setTimeout(() => {
            $( e.trigger ).blur().tooltip( 'hide' );
        }, 1000);
    });

    // // handle clipboard on error
    // clipboard.on('error', (e) => {
    // });
    // [ClipboardJS] ::end

    // [Main Navigation] ::start
    $( '#sg-navigation .nav-link' ).each( (index, el) => {
        $( el ).on( 'click', ( e ) => {
            $( '#sg-navigation' ).collapse( 'hide' );
        });
    });
    // [Main Navigation] ::end

    // [Checkbox Indeterminate Event] ::start
    window.changeState = (el) => {
        if (el.readOnly) {
            el.checked = el.readOnly = false;
        } else if (!el.checked) {
            el.readOnly = el.indeterminate = true;
        }
    };
    // [Checkbox Indeterminate Event] ::end

    // [BootstrapDialog] ::start
    (() => {

        let modalDialogBtn = html.find( '.btn--modal-dialog' ),
            modalDialogBtnTypes = html.find( '.btn--modal-dialog-type' ),
            modalDialogBtnSizes = html.find( '.btn--modal-dialog-size' ),
            modalDialogTypes = [
                BootstrapDialog.TYPE_DEFAULT,
                BootstrapDialog.TYPE_INFO,
                BootstrapDialog.TYPE_PRIMARY,
                BootstrapDialog.TYPE_SUCCESS,
                BootstrapDialog.TYPE_WARNING,
                BootstrapDialog.TYPE_DANGER
            ],
            modalDialogSizes = [
                BootstrapDialog.SIZE_NORMAL,
                BootstrapDialog.SIZE_LARGE,
            ];

        modalDialogBtn.on( 'click', (e) => {
            BootstrapDialog.show({
                title: 'Modal Dialog title',
                message: 'Modal Dialog body text goes here.',
                buttons: [
                    {
                        label: 'Close',
                        cssClass: 'btn btn-secondary'
                    },
                    {
                        label: 'Save Changes',
                        cssClass: 'btn btn-primary'
                    },
                ],
            });
        });

        modalDialogBtnTypes.on( 'click', (e) => {
            $.each(modalDialogTypes, function(index, type){
                BootstrapDialog.show({
                    type: type,
                    title: 'Modal Dialog Type: ' + type,
                    message: 'Modal Dialog body text goes here.',
                    buttons: [
                        {
                            label: 'Close',
                            cssClass: 'btn btn-secondary'
                        },
                        {
                            label: 'Save Changes',
                            cssClass: 'btn btn-primary'
                        },
                    ],
                });
            });
        });

        modalDialogBtnSizes.on( 'click', (e) => {
            $.each(modalDialogSizes, function(index, size){
                BootstrapDialog.show({
                    size: size,
                    title: 'Modal Dialog Type: ' + size,
                    message: 'Modal Dialog body text goes here.',
                    buttons: [
                        {
                            label: 'Close',
                            cssClass: 'btn btn-secondary'
                        },
                        {
                            label: 'Save Changes',
                            cssClass: 'btn btn-primary'
                        },
                    ],
                });
            });
        });

    })();
    // [BootstrapDialog] ::end

});



