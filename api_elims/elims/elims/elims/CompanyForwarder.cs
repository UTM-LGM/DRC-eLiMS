using System;
using System.Collections.Generic;

namespace elims.elims;

public partial class CompanyForwarder
{
    public int Id { get; set; }

    public int? CompanyId { get; set; }

    public int? ForwarderId { get; set; }
}
